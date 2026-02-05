import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Check, ChevronRight, HelpCircle, AlertCircle, Play } from 'lucide-react';

interface CalculationStep {
    id: string;
    instruction: string;
    hint: string;
    expectedValue: number;
    unit: string;
    explanation: string;
    formula?: string;
    substitution?: string;
}

interface Question {
    id: string;
    title: string;
    scenario: string;
    knownVariables: Record<string, number>;
    type: 'cg_calc' | 'mass_shift' | 'percent_mac' | 'mass_add_limit' | 'floor_load' | 'mass_defs';
    steps: CalculationStep[];
}

const QUESTIONS: Question[] = [
    {
        id: 'q1',
        title: 'Calculate New CG after Loading',
        scenario: "An aircraft has a mass of 5000 kg and a CG at station 150. You load 400 kg of cargo at station 500. What is the new CG position?",
        type: 'cg_calc',
        knownVariables: {
            'Old Mass': 5000,
            'Old CG': 150,
            'Cargo Mass': 400,
            'Cargo Arm': 500
        },
        steps: [
            {
                id: 's1',
                instruction: 'Calculate the Initial Moment.',
                hint: 'Moment = Mass × Arm. Use the Old Mass and Old CG.',
                expectedValue: 750000, // 5000 * 150
                unit: 'kg-in',
                explanation: 'Correct! The initial moment is 5,000kg × 150in = 750,000 kg-in.'
            },
            {
                id: 's2',
                instruction: 'Calculate the Moment of the new Cargo.',
                hint: 'Multiply the Cargo Mass by the Cargo Arm.',
                expectedValue: 200000, // 400 * 500
                unit: 'kg-in',
                explanation: 'Spot on. 400kg × 500in = 200,000 kg-in.'
            },
            {
                id: 's3',
                instruction: 'Find the Total Mass.',
                hint: 'Add the Cargo Mass to the Initial Mass.',
                expectedValue: 5400, // 5000 + 400
                unit: 'kg',
                explanation: 'Exactly. 5,000kg + 400kg = 5,400kg.'
            },
            {
                id: 's4',
                instruction: 'Find the Total Moment.',
                hint: 'Add the Initial Moment to the Cargo Moment.',
                expectedValue: 950000, // 750000 + 200000
                unit: 'kg-in',
                explanation: 'Correct. 750,000 + 200,000 = 950,000 kg-in.'
            },
            {
                id: 's5',
                instruction: 'Calculate Final CG.',
                hint: 'Divide Total Moment by Total Mass.',
                expectedValue: 175.93, // 950000 / 5400 (approx) - logic handles range
                unit: 'in',
                explanation: 'Perfect! New CG = 950,000 / 5,400 = 175.93 inches.'
            }
        ]
    },
    {
        id: 'q2',
        title: 'Mass Shift Required',
        scenario: "Aircraft Mass 40,000kg. CG is 20 inches too far AFT. How much mass must be moved from the AFT hold (Arm 800) to the FWD hold (Arm 200) to correct this?",
        type: 'mass_shift',
        knownVariables: {
            'Mass': 40000,
            'Desired Shift': 20,
            'Arm FROM': 800,
            'Arm TO': 200
        },
        steps: [
            {
                id: 's1',
                instruction: 'Calculate the Distance between holds.',
                hint: 'Difference between Arm FROM and Arm TO.',
                expectedValue: 600,
                unit: 'in',
                explanation: 'Correct. The mass moves 600 inches forward (800 - 200).'
            },
            {
                id: 's2',
                instruction: 'Calculate Mass to Move.',
                hint: 'Formula: Mass to Move = (Total Mass × Change of CG) / Distance Moved',
                expectedValue: 1333.3,
                unit: 'kg',
                explanation: 'Outstanding. (40,000 × 20) / 600 = 1,333 kg.'
            }
        ]
    },
    {
        id: 'q3',
        title: 'Mass Addition to Reach a Limit',
        scenario: "Current Mass 35,000kg, CG 400 inches. You want to add cargo at station 800 to reach the Aft Limit of 420 inches. What is the maximum mass you can add?",
        type: 'mass_add_limit',
        knownVariables: {
            'Current Mass': 35000,
            'Current CG': 400,
            'New Arm': 800,
            'Target CG': 420
        },
        steps: [
            {
                id: 's1',
                instruction: 'Identify the Distance from New Arm to Target CG.',
                hint: 'New Arm (800) - Target CG (420). This is the "arm of the added mass relative to the limit".',
                expectedValue: 380,
                unit: 'in',
                explanation: 'Correct. The added mass is 380 inches away from the limit.'
            },
            {
                id: 's2',
                instruction: 'Identify the Distance from Current CG to Target CG.',
                hint: 'Target CG (420) - Current CG (400). This is how much we can shift.',
                expectedValue: 20,
                unit: 'in',
                explanation: 'Correct. We need to shift the CG aft by 20 inches.'
            },
            {
                id: 's3',
                instruction: 'Calculate Max Added Mass.',
                hint: 'Formula: Added Mass = (Total Mass × Shift Needed) / (Dist New Arm to Old CG - Shift Needed). Or easier: ΔMass = (Old Mass × ΔCG) / (New Arm - New CG).',
                expectedValue: 1842.1,
                unit: 'kg',
                explanation: 'Well done. (35,000 × 20) / (800 - 420) = 1,842 kg.'
            }
        ]
    },
    {
        id: 'q4',
        title: '% MAC Conversion',
        scenario: "LEMAC is at station 400. TEMAC is at station 700. The CG is located at station 490. What is the CG in %MAC?",
        type: 'percent_mac',
        knownVariables: {
            'LEMAC': 400,
            'TEMAC': 700,
            'CG Arm': 490
        },
        steps: [
            {
                id: 's1',
                instruction: 'Calculate the Length of the MAC.',
                hint: 'TEMAC - LEMAC.',
                expectedValue: 300,
                unit: 'in',
                explanation: 'Correct. MAC Length is 700 - 400 = 300 inches.'
            },
            {
                id: 's2',
                instruction: 'Calculate the Distance of CG from LEMAC.',
                hint: 'CG Arm - LEMAC.',
                expectedValue: 90,
                unit: 'in',
                explanation: 'Correct. The CG is 90 inches aft of the Leading Edge.'
            },
            {
                id: 's3',
                instruction: 'Calculate % MAC.',
                hint: '(Distance from LEMAC / MAC Length) × 100.',
                expectedValue: 30,
                unit: '%',
                explanation: 'Perfect. (90 / 300) × 100 = 30% MAC.'
            }
        ]
    },
    {
        id: 'q5',
        title: 'Running Load & Floor Loading',
        scenario: "A crate weighs 1200 kg and has dimensions 2m x 1m. The floor contact area is 2m² (2x1). The running load limit is 500 kg/m (linear). Does the crate exceed the RUNNING load limit along the 2m side?",
        type: 'floor_load',
        knownVariables: {
            'Mass': 1200,
            'Length (Along fuselage)': 2,
            'Width': 1,
            'Running Limit': 500
        },
        steps: [
            {
                id: 's1',
                instruction: 'Calculate the actual Running Load.',
                hint: 'Running Load = Mass / Length (along the fuselage).',
                expectedValue: 600,
                unit: 'kg/m',
                explanation: 'Correct. 1200kg / 2m = 600 kg/m.'
            },
            {
                id: 's2',
                instruction: 'Compare with Limit. Enter the Excess amount (0 if safe).',
                hint: 'Actual (600) - Limit (500).',
                expectedValue: 100,
                unit: 'kg/m',
                explanation: 'Correct. It exceeds the limit by 100 kg/m. Spreader bars are required!'
            }
        ]
    },
    {
        id: 'q6',
        title: 'Mass Definitions',
        scenario: "DOM: 30,000kg. Traffic Load: 8,000kg. Trip Fuel: 2,000kg. Reserve Fuel: 1,000kg. Taxi Fuel: 200kg. What is the Take-Off Mass (TOM)?",
        type: 'mass_defs',
        knownVariables: {
            'DOM': 30000,
            'Traffic Load': 8000,
            'Trip Fuel': 2000,
            'Res Fuel': 1000,
            'Taxi Fuel': 200
        },
        steps: [
            {
                id: 's1',
                instruction: 'Calculate Zero Fuel Mass (ZFM).',
                hint: 'ZFM = DOM + Traffic Load.',
                expectedValue: 38000,
                unit: 'kg',
                explanation: 'Correct. 30,000 + 8,000 = 38,000kg.'
            },
            {
                id: 's2',
                instruction: 'Calculate Total Fuel on Board at Take-off.',
                hint: 'Trip Fuel + Reserve Fuel. (Taxi fuel is burned before takeoff).',
                expectedValue: 3000,
                unit: 'kg',
                explanation: 'Correct. 2,000 + 1,000 = 3,000kg.'
            },
            {
                id: 's3',
                instruction: 'Calculate Take-Off Mass (TOM).',
                hint: 'TOM = ZFM + Take-off Fuel.',
                expectedValue: 41000,
                unit: 'kg',
                explanation: 'Excellent. 38,000 + 3,000 = 41,000kg.'
            }
        ]
    }
];

const MassBalanceQuizWizard: React.FC = () => {
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [userInputs, setUserInputs] = useState<Record<string, string>>({});
    const [stepStatus, setStepStatus] = useState<'pending' | 'correct' | 'incorrect'>('pending');
    const [showHint, setShowHint] = useState(false);
    const [isWalkthrough, setIsWalkthrough] = useState(false);

    const question = QUESTIONS[activeQuestionIndex];
    const step = question.steps[currentStepIndex];

    const checkStep = () => {
        const val = parseFloat(userInputs[step.id] || '0');
        // Allow 1% tolerance or 0.1 differnece
        const isClose = Math.abs(val - step.expectedValue) < (step.expectedValue * 0.01) || Math.abs(val - step.expectedValue) < 0.1;

        if (isClose) {
            setStepStatus('correct');
        } else {
            setStepStatus('incorrect');
        }
    };

    const nextStep = () => {
        if (currentStepIndex < question.steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setStepStatus('pending');
            setShowHint(false);
        } else {
            // Next Question or Finish
            if (activeQuestionIndex < QUESTIONS.length - 1) {
                setActiveQuestionIndex(activeQuestionIndex + 1);
                setCurrentStepIndex(0);
                setStepStatus('pending');
                setUserInputs({});
                setShowHint(false);
                setIsWalkthrough(false);
            }
        }
    };

    // Activate breakdown mode
    const activateWalkthrough = () => {
        setIsWalkthrough(true);
    };

    const applyWalkthroughAnswer = () => {
        setUserInputs({
            ...userInputs,
            [step.id]: step.expectedValue.toString()
        });
        setStepStatus('correct');
        setIsWalkthrough(false);
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < QUESTIONS.length) {
            setActiveQuestionIndex(index);
            setCurrentStepIndex(0);
            setStepStatus('pending');
            setUserInputs({});
            setShowHint(false);
            setIsWalkthrough(false);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 border-b border-slate-700 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-500/20 p-2 rounded-lg">
                            <Calculator className="text-emerald-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-emerald-400">Guided Calculation Wizard</h1>
                    </div>
                    <p className="text-slate-400 text-lg">
                        Step-by-step breakdown of Mass & Balance exam questions. We won't let you fail.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Scenario Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 text-xs uppercase tracking-widest font-bold">Current Problem</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => goToQuestion(activeQuestionIndex - 1)}
                                        disabled={activeQuestionIndex === 0}
                                        className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronRight className="rotate-180" size={16} />
                                    </button>
                                    <span className="text-xs font-mono text-slate-400">
                                        {activeQuestionIndex + 1} / {QUESTIONS.length}
                                    </span>
                                    <button
                                        onClick={() => goToQuestion(activeQuestionIndex + 1)}
                                        disabled={activeQuestionIndex === QUESTIONS.length - 1}
                                        className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-4">{question.title}</h2>
                            <p className="text-slate-300 mb-6 italic border-l-2 border-emerald-500 pl-4">
                                "{question.scenario}"
                            </p>

                            <div className="space-y-3">
                                {Object.entries(question.knownVariables).map(([key, val]) => (
                                    <div key={key} className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                                        <span className="text-slate-400">{key}</span>
                                        <span className="font-mono text-emerald-300 font-bold">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-2 font-bold">Progress</h3>
                            <div className="flex gap-1 mb-2">
                                {question.steps.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className={`h-2 flex-1 rounded-full ${i < currentStepIndex ? 'bg-emerald-500' : i === currentStepIndex ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}
                                    ></div>
                                ))}
                            </div>
                            <div className="text-xs text-right text-slate-500">
                                Step {currentStepIndex + 1} of {question.steps.length}
                            </div>
                        </div>
                    </div>

                    {/* Interaction Panel */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-slate-900 font-bold shrink-0">
                                        {currentStepIndex + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{step.instruction}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => setShowHint(!showHint)}
                                                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <HelpCircle size={12} />
                                                {showHint ? 'Hide Hint' : 'Need a Hint?'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {showHint && (
                                    <motion.div
                                        initial={{ height: 0 }} animate={{ height: 'auto' }}
                                        className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6 text-blue-200 text-sm overflow-hidden"
                                    >
                                        💡 {step.hint}
                                    </motion.div>
                                )}

                                <div className="mb-8">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={userInputs[step.id] || ''}
                                            onChange={(e) => setUserInputs({ ...userInputs, [step.id]: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && checkStep()}
                                            disabled={stepStatus === 'correct'}
                                            placeholder="Enter value..."
                                            className={`w-full bg-slate-900 border-2 rounded-xl px-6 py-4 text-2xl font-mono outline-none transition-all ${stepStatus === 'correct' ? 'border-emerald-500 text-emerald-400' :
                                                stepStatus === 'incorrect' ? 'border-red-500 text-white' :
                                                    'border-slate-700 focus:border-emerald-500/50 text-white'
                                                }`}
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                            {step.unit}
                                        </span>
                                    </div>
                                </div>

                                {/* Feedback Area */}
                                {stepStatus === 'incorrect' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 text-red-400 mb-6 bg-red-950/30 p-4 rounded-lg"
                                    >
                                        <AlertCircle />
                                        <span>Not quite. Check your calculation or try the hint!</span>
                                    </motion.div>
                                )}

                                {stepStatus === 'correct' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="mb-8"
                                    >
                                        <div className="flex items-center gap-3 text-emerald-400 mb-2 bg-emerald-950/30 p-4 rounded-lg">
                                            <Check />
                                            <span className="font-bold">Correct!</span>
                                        </div>
                                        <p className="text-slate-300 ml-2">{step.explanation}</p>
                                    </motion.div>
                                )}

                                <div className="flex gap-4">
                                    {stepStatus !== 'correct' && !isWalkthrough ? (
                                        <>
                                            <button
                                                onClick={checkStep}
                                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                                            >
                                                Check Answer
                                            </button>
                                            <button
                                                onClick={activateWalkthrough}
                                                className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all font-medium text-sm"
                                            >
                                                Show Me How
                                            </button>
                                        </>
                                    ) : isWalkthrough ? (
                                        <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-6">
                                            <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                                <Play size={16} />
                                                Step Breakdown
                                            </h4>

                                            <div className="space-y-4 mb-6">
                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Formula / Logic</div>
                                                    <div className="font-mono text-white text-lg bg-slate-800 p-2 rounded">
                                                        {step.formula || step.hint}
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <div className="h-6 w-px bg-slate-700"></div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Substitution</div>
                                                    <div className="font-mono text-cyan-300 text-lg bg-slate-800 p-2 rounded">
                                                        {step.substitution || 'Substitute Known Values'}
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <div className="h-6 w-px bg-slate-700"></div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Result</div>
                                                    <div className="font-mono text-emerald-400 text-2xl font-bold">
                                                        {step.expectedValue} <span className="text-sm text-slate-500">{step.unit}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={applyWalkthroughAnswer}
                                                className="w-full bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-200 font-bold py-3 rounded-lg transition-colors"
                                            >
                                                Use This Result
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={nextStep}
                                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            {currentStepIndex < question.steps.length - 1 ? 'Next Step' : 'Complete Question'}
                                            <ChevronRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MassBalanceQuizWizard;
