import React, { useState } from 'react';
import { Apple, Scale, Calculator, AlertTriangle } from 'lucide-react';

const HPLMetabolism: React.FC = () => {
    const [tab, setTab] = useState<'bmi' | 'sugar' | 'bmr'>('bmi');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Apple className="w-6 h-6 text-orange-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Metabolism & Nutrition</h1>
                </div>
                <p className="text-slate-400">
                    Fueling the body for flight. Understanding energy requirements and the dangers of hypoglycemia.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('bmi')} className={`flex-1 py-2 rounded transition-colors ${tab === 'bmi' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>BMI Calculator</button>
                <button onClick={() => setTab('sugar')} className={`flex-1 py-2 rounded transition-colors ${tab === 'sugar' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Blood Sugar</button>
                <button onClick={() => setTab('bmr')} className={`flex-1 py-2 rounded transition-colors ${tab === 'bmr' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>BMR Rate</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'bmi' && <BMICalculator />}
                {tab === 'sugar' && <BloodSugarSim />}
                {tab === 'bmr' && <BMRInfo />}
            </div>
        </div>
    );
};

const BMICalculator = () => {
    const [height, setHeight] = useState(175);
    const [weight, setWeight] = useState(75);

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const bmiNum = parseFloat(bmi);

    let category = '';
    let catColor = '';

    if (bmiNum < 18.5) { category = 'Underweight'; catColor = 'text-blue-400'; }
    else if (bmiNum < 25) { category = 'Normal'; catColor = 'text-green-400'; }
    else if (bmiNum < 30) { category = 'Overweight'; catColor = 'text-yellow-400'; }
    else { category = 'Obese'; catColor = 'text-red-400'; }

    return (
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div>
                    <label className="block text-slate-300 mb-2 font-medium">Height (cm): <span className="text-white font-bold">{height}</span></label>
                    <input
                        type="range" min="140" max="220" value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="w-full accent-orange-500"
                    />
                </div>
                <div>
                    <label className="block text-slate-300 mb-2 font-medium">Weight (kg): <span className="text-white font-bold">{weight}</span></label>
                    <input
                        type="range" min="40" max="150" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))}
                        className="w-full accent-orange-500"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-900 p-8 rounded-2xl border border-slate-700">
                <div className="text-sm text-slate-400 uppercase font-bold tracking-widest mb-2">Body Mass Index</div>
                <div className="text-6xl font-black text-white mb-2">{bmi}</div>
                <div className={`text-xl font-bold ${catColor}`}>{category}</div>

                <div className="w-full h-2 bg-slate-700 rounded-full mt-6 overflow-hidden flex">
                    <div className="w-[18.5%] bg-blue-500 h-full" title="Underweight"></div>
                    <div className="w-[13%] bg-green-500 h-full" title="Normal"></div>
                    <div className="w-[10%] bg-yellow-500 h-full" title="Overweight"></div>
                    <div className="flex-1 bg-red-500 h-full" title="Obese"></div>
                </div>
                <div className="w-full flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>0</span>
                    <span className="ml-[18.5%]">18.5</span>
                    <span className="ml-[10%]">25</span>
                    <span className="ml-[8%]">30</span>
                    <span>40+</span>
                </div>
            </div>
        </div>
    );
};

const BloodSugarSim = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Blood Glucose Levels</h3>
            <p className="text-slate-300">
                The brain relies exclusively on glucose for energy. It cannot store it. Maintaining stable levels is critical for cognition.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-red-500" />
                        <h4 className="text-lg font-bold text-red-400">Hypoglycaemia (Low)</h4>
                    </div>

                    <p className="text-sm text-slate-300 mb-4">
                        Caused by skipped meals, excessive insulin, or strenuous exercise without food. Crucial hazard in aviation.
                    </p>

                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex gap-2 text-white">
                            <span className="text-red-500 font-bold">•</span> Confusion / Drowsiness
                        </li>
                        <li className="flex gap-2 text-white">
                            <span className="text-red-500 font-bold">•</span> Trembling / Shaking
                        </li>
                        <li className="flex gap-2 text-white">
                            <span className="text-red-500 font-bold">•</span> Aggression
                        </li>
                        <li className="flex gap-2 text-white">
                            <span className="text-red-500 font-bold">•</span> Coma (Severe)
                        </li>
                    </ul>
                </div>

                <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="text-orange-500" />
                        <h4 className="text-lg font-bold text-orange-400">Hyperglycaemia (High)</h4>
                    </div>

                    <p className="text-sm text-slate-300 mb-4">
                        Often associated with diabetes. High, persistent levels damage blood vessels and nerves over time.
                    </p>

                    <div className="space-y-2">
                        <div className="bg-slate-900 p-3 rounded text-xs text-slate-300">
                            <strong>Glycaemic Index (GI):</strong> Measures how quickly foods raise blood sugar.
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-red-500/10 p-2 rounded text-red-200">
                                High GI (Sugar, White Bread) <br /> Rapid spike followed by crash.
                            </div>
                            <div className="bg-green-500/10 p-2 rounded text-green-200">
                                Low GI (Oats, Vegetables) <br /> Slow release, sustained energy.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BMRInfo = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Basal Metabolic Rate (BMR)</h3>
        <p className="text-slate-300">
            The amount of energy expanded while at rest in a neutral temperate environment to maintain vital organ functions.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-orange-400 mb-4">Factors Increasing BMR</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li>• <strong>Muscle Mass:</strong> Muscle burns more than fat.</li>
                    <li>• <strong>Body Surface Area:</strong> Tall/thin people have higher BMR.</li>
                    <li>• <strong>Male Gender:</strong> Typically higher muscle mass.</li>
                    <li>• <strong>Stress:</strong> Adrenaline release.</li>
                    <li>• <strong>Extreme Temps:</strong> Body burns energy to heat/cool.</li>
                    <li>• <strong>Growth/Pregnancy</strong></li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-blue-400 mb-4">Factors Decreasing BMR</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li>• <strong>Age:</strong> BMR decreases with age.</li>
                    <li>• <strong>Female Gender:</strong> Typically lower muscle mass.</li>
                    <li>• <strong>Sleep:</strong> Drops slightly (~10%).</li>
                    <li>• <strong>Starvation:</strong> Body conserves energy.</li>
                </ul>
            </div>
        </div>

        <div className="text-center text-sm text-slate-500 bg-black/20 p-4 rounded-lg">
            Metabolic Rate = Energy Output / Time. <br />
            Measured in Joules (or Calories). 1 Calorie (kcal) = 4.184 kJ.
        </div>
    </div>
);

export default HPLMetabolism;
