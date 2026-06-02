import React, { useState } from 'react';
import { View } from '../../types';
import { 
  ArrowLeft, Users, ShieldAlert, Award, RotateCcw, ChevronRight, CheckCircle, Brain, Info
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

interface ScenarioStep {
  id: number;
  narrative: string;
  options: {
    text: string;
    nextStep: number;
    attitudeType: 'SAFE' | 'ANTI_AUTHORITY' | 'IMPULSIVITY' | 'INVULNERABILITY' | 'MACHO' | 'RESIGNATION';
    feedback: string;
  }[];
}

const scenarioData: ScenarioStep[] = [
  {
    id: 1,
    narrative: "You are the First Officer on EgyptAir flight MS 779 from London to Cairo (HECA). Approaching Cairo, ATC reports active sandstorms with a crosswind component of 34 Knots, which is exactly at your aircraft's maximum demonstrated limit. Your fuel is close to minimum reserves due to terminal holds. The Captain says: 'Let's push it in quickly before the visibility gets worse. Cairo is our home base, we can handle it.' Which hazardous attitude is the Captain exhibiting, and how do you respond?",
    options: [
      {
        text: "Say: 'Let's go for it, Captain! We are EgyptAir crew, we know this runway inside out. We've landed in worse conditions.'",
        nextStep: 2,
        attitudeType: 'MACHO',
        feedback: "Choosing to show off your piloting prowess or acting 'macho' is a dangerous hazardous attitude. Operating right at the limit in sandstorms is high-risk."
      },
      {
        text: "Say: 'Captain, 34 knots is our absolute crosswind limit. Our fuel is at minimum reserves. For safety, let's request a holding pattern to assess, or prepare for our alternate in Alexandria (HEBA).'",
        nextStep: 3,
        attitudeType: 'SAFE',
        feedback: "Excellent decision! Pointing out clear limits and offering safe options (holding or diversion) matches EASA/ECAA Threat and Error Management."
      },
      {
        text: "Keep quiet. The Captain is senior and knows best. It's your job to just monitor instruments and follow orders.",
        nextStep: 4,
        attitudeType: 'RESIGNATION',
        feedback: "Resignation ('What's the use?') and passive obedience lead to high cockpit authority gradients and have contributed to numerous accidents. CRM demands active monitoring and cross-checking."
      }
    ]
  },
  {
    id: 2,
    narrative: "During the approach, sudden severe windshear is encountered. The airspeed fluctuates by 18 knots, and the glidepath dips. The Captain seems focused on forcing the aircraft down on the runway. What is your immediate action?",
    options: [
      {
        text: "Call out: 'Windshear! Go-around!' firmly, and be prepared to take controls if the Captain does not immediately initiate the escape profile.",
        nextStep: 5,
        attitudeType: 'SAFE',
        feedback: "Superb. In a windshear encounter, ECAA standard operating procedures demand an immediate go-around and full thrust escape maneuver."
      },
      {
        text: "Wait and see if the Captain corrects. You don't want to cause an unnecessary go-around or disrupt the Captain's focus.",
        nextStep: 4,
        attitudeType: 'RESIGNATION',
        feedback: "Waiting is passive resignation. In windshear, seconds matter. A passive stance increases risk significantly."
      },
      {
        text: "Grab the sidestick and yank it back immediately without saying anything to override the Captain's pitch.",
        nextStep: 6,
        attitudeType: 'IMPULSIVITY',
        feedback: "Impulsivity ('Do something quickly!') without clear crew communication leads to dual-input warnings and cockpit confusion."
      }
    ]
  },
  {
    id: 3,
    narrative: "You have requested a hold and the wind stabilizes slightly. You are executing the final approach. However, the flight crew is fatigued after a long duty day. The Captain misses an altitude callout. How do you intervene?",
    options: [
      {
        text: "Make the callout clearly: 'One thousand feet, stabilized, runway in sight.' and check for the Captain's response.",
        nextStep: 5,
        attitudeType: 'SAFE',
        feedback: "Excellent CRM. Clear, standardized, and assertive callouts ensure situational awareness is maintained."
      },
      {
        text: "Let it slide. The Captain probably knows the altitude and doesn't need to be micromanaged by a First Officer.",
        nextStep: 4,
        attitudeType: 'RESIGNATION',
        feedback: "Resignation again. Standard callouts are mandatory crew coordination gates, not optional check-items."
      }
    ]
  },
  {
    id: 4,
    narrative: "The flight lands, but is extremely rough, causing gear strut inspection alerts. In the post-flight briefing, the Captain says: 'Let's omit this rough landing from the logbook so we don't delay the next crew.' What is your stance?",
    options: [
      {
        text: "Agree. Airframe structures are built tough, nothing could have broken anyway. It's better to keep EgyptAir flights on schedule.",
        nextStep: 6,
        attitudeType: 'INVULNERABILITY',
        feedback: "Invulnerability ('It won't happen to me/us') is a classic hazardous attitude. Mechanical stresses must be recorded to prevent structural failure."
      },
      {
        text: "Refuse firmly: 'Captain, structural limitations are flight safety barriers. We must log this rough landing so maintenance can perform the mandatory NDT inspections as required by ECARs.'",
        nextStep: 7,
        attitudeType: 'SAFE',
        feedback: "Excellent! Enforcing airworthiness logging rules protects subsequent crews and aligns perfectly with company directives."
      },
      {
        text: "Say: 'Fine, but if something goes wrong, it's your responsibility, not mine.'",
        nextStep: 6,
        attitudeType: 'ANTI_AUTHORITY',
        feedback: "Deflecting responsibility or expressing passive anti-authority does not remove your liability as a licensed flight crew member."
      }
    ]
  },
  {
    id: 5,
    narrative: "The flight successfully executes a safe go-around and diverts to Alexandria (HEBA) where winds are calm. The landing is uneventful. In the terminal, the station manager says: 'Why did you divert? It causes massive hotel costs for EgyptAir!' The Captain looks at you to explain. How do you justify the decision?",
    options: [
      {
        text: "Present the facts: 'We faced wind components exceeding demonstrated structural limits, severe windshear alerts, and were at minimum contingency fuel reserves. Flight safety is our first priority under ECAA policies.'",
        nextStep: 7,
        attitudeType: 'SAFE',
        feedback: "Exceptional. Clear, professional, and factual justification based on safety limits is unassailable."
      },
      {
        text: "Say: 'It was the Captain's call, I just did what I was told.'",
        nextStep: 6,
        attitudeType: 'RESIGNATION',
        feedback: "Failing to stand by a collaborative safety decision displays resignation. You are a unified crew."
      }
    ]
  },
  {
    id: 6,
    narrative: "Your actions in the simulator resulted in a high-risk operational profile with multiple hazardous attitudes activated. Your CRM scorecard has flagged key improvement areas.",
    options: []
  },
  {
    id: 7,
    narrative: "Congratulations! You have completed the cockpit crisis simulator with exceptional CRM awareness. You demonstrated assertiveness, strictly adhered to ECAA limitations, and successfully avoided hazardous attitudes.",
    options: []
  }
];

export const EgyptAirADMCrmSimulator: React.FC<Props> = ({ onChangeView }) => {
  const [currentStepId, setCurrentStepId] = useState(1);
  const [feedbackText, setFeedbackText] = useState('');
  const [attitudesActivated, setAttitudesActivated] = useState<string[]>([]);
  const [totalStepsCount, setTotalStepsCount] = useState(0);

  const currentStep = scenarioData.find(step => step.id === currentStepId) || scenarioData[0];

  const handleOptionClick = (opt: typeof scenarioData[0]['options'][0]) => {
    setFeedbackText(opt.feedback);
    if (opt.attitudeType !== 'SAFE') {
      setAttitudesActivated(prev => [...new Set([...prev, opt.attitudeType])]);
    }
    setTotalStepsCount(prev => prev + 1);
    setCurrentStepId(opt.nextStep);
  };

  const handleReset = () => {
    setCurrentStepId(1);
    setFeedbackText('');
    setAttitudesActivated([]);
    setTotalStepsCount(0);
  };

  const isEndState = currentStep.options.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans text-slate-100">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
            className="inline-flex items-center px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-white/5 transition-all text-sm active:scale-95"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Cadet Portal
          </button>
          
          <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest">
            <Users size={16} /> CRM & ADM Simulator
          </div>
        </div>

        {/* main simulator box */}
        <div className="glass-card bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 md:p-10 space-y-6">
          
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">CRM & Decision Lab</h2>
              <p className="text-slate-400 text-sm">Interactive Aeronautical Decision Making (ADM) scenarios based on EgyptAir SOPs.</p>
            </div>
          </div>
          
          <div className="border-t border-white/5 my-4"></div>

          {!isEndState ? (
            <div className="space-y-6">
              
              {/* Narrative Panel */}
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/5 space-y-4">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Scenario Brief</div>
                <p className="text-slate-200 text-base leading-relaxed">{currentStep.narrative}</p>
              </div>

              {/* Feedback Alert from Previous Step */}
              {feedbackText && (
                <div className="p-4 bg-blue-950/20 border border-blue-500/25 text-blue-200 rounded-xl text-xs flex items-start gap-3 animate-in fade-in duration-300">
                  <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <p>{feedbackText}</p>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Choose Your Action</div>
                {currentStep.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    className="w-full text-left p-5 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-900 hover:border-purple-500/30 text-slate-300 hover:text-white transition-all text-sm flex items-center justify-between group active:scale-[0.99]"
                  >
                    <span className="leading-relaxed pr-6">{opt.text}</span>
                    <ChevronRight size={18} className="text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all shrink-0" />
                  </button>
                ))}
              </div>

            </div>
          ) : (
            /* End State: Results and TEM Scorecard */
            <div className="space-y-8 py-6">
              
              <div className="text-center space-y-3 max-w-md mx-auto">
                <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/20 w-fit mx-auto text-purple-400">
                  <Award size={64} className="animate-bounce" />
                </div>
                <h3 className="text-3xl font-black text-white">Scenario Complete</h3>
                <p className="text-slate-400 text-sm">{currentStep.narrative}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* TEM Scorecard */}
                <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Threat & Error Scorecard</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-slate-950 rounded-xl">
                      <div className="text-xs text-slate-500">Steps Taken</div>
                      <div className="text-2xl font-black text-white font-mono mt-1">{totalStepsCount}</div>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl">
                      <div className="text-xs text-slate-500">Safety Rating</div>
                      <div className={`text-2xl font-black font-mono mt-1 ${attitudesActivated.length === 0 ? 'text-green-400' : 'text-amber-400'}`}>
                        {attitudesActivated.length === 0 ? 'EXCELLENT' : 'REVIEW'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Activated Hazardous Attitudes</div>
                    {attitudesActivated.length === 0 ? (
                      <div className="text-xs text-green-400 flex items-center gap-2">
                        <CheckCircle size={14} /> Zero hazardous attitudes triggered. Superb safety discipline.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {attitudesActivated.map((att, index) => (
                          <span key={index} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold rounded-lg uppercase">
                            {att.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CRM Analysis */}
                <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3 text-xs text-slate-400 leading-relaxed">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">EgyptAir CRM Reference</h4>
                  <p>
                    <strong>Hazardous Attitudes:</strong> In modern aviation, pilot errors are frequently linked to specific psychological states. EgyptAir OM-A Chapter 17 outlines the 5 key hazardous attitudes and their standard antidotes:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 pt-1">
                    <li><strong>Macho:</strong> <em>Antidote:</em> Taking chances is foolish.</li>
                    <li><strong>Resignation:</strong> <em>Antidote:</em> I'm not helpless. I can make a difference.</li>
                    <li><strong>Impulsivity:</strong> <em>Antidote:</em> Not so fast. Think first.</li>
                    <li><strong>Invulnerability:</strong> <em>Antidote:</em> It could happen to me.</li>
                    <li><strong>Anti-Authority:</strong> <em>Antidote:</em> Follow the rules. They are usually right.</li>
                  </ul>
                </div>

              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw size={16} /> Restart Simulator
                </button>
                <button 
                  onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Back to Dashboard
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EgyptAirADMCrmSimulator;
