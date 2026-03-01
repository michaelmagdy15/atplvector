
import React, { useState } from 'react';
import { Flame, Scale, Utensils, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const HPLMetabolism: React.FC = () => {
    const [tab, setTab] = useState<'bmr' | 'glucose' | 'bmi'>('bmr');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Metabolism & Nutrition</h1>
                </div>
                <p className="text-slate-400">
                    Energy conversion, blood sugar regulation, and body mass management.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton active={tab === 'bmr'} onClick={() => setTab('bmr')} icon={Flame} label="BMR & Energy" />
                <TabButton active={tab === 'glucose'} onClick={() => setTab('glucose')} icon={Utensils} label="Glucose" />
                <TabButton active={tab === 'bmi'} onClick={() => setTab('bmi')} icon={Scale} label="BMI Calc" />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {tab === 'bmr' && <BMRInfo />}
                {tab === 'glucose' && <GlucoseSim />}
                {tab === 'bmi' && <BMICalculator />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const BMRInfo = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">Basal Metabolic Rate</h3>
                <p className="text-slate-400 text-sm">
                    The energy required to keep you alive at complete rest (Breathing, Heartbeat, Temp).
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-orange-500 transition-colors">
                    <div>
                        <h4 className="font-bold text-white">Carbohydrates</h4>
                        <p className="text-xs text-slate-400">Short term energy. Glucose.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-orange-500">4</div>
                        <div className="text-xs text-slate-500">kcal/g</div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-yellow-500 transition-colors">
                    <div>
                        <h4 className="font-bold text-white">Proteins</h4>
                        <p className="text-xs text-slate-400">Repair & Build. Amino Acids.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-yellow-500">4</div>
                        <div className="text-xs text-slate-500">kcal/g</div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-red-500 transition-colors">
                    <div>
                        <h4 className="font-bold text-white">Fats (Lipids)</h4>
                        <p className="text-xs text-slate-400">Long term storage. Insulation.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-red-500">9</div>
                        <div className="text-xs text-slate-500">kcal/g</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center">
            <div className="w-48 h-48 rounded-full border-8 border-slate-700 flex flex-col items-center justify-center mb-6 relative hover:scale-105 transition-transform">
                <div className="text-4xl font-black text-white">2500</div>
                <div className="text-sm font-bold text-slate-500">Avg Calories</div>
                <div className="absolute inset-0 border-8 border-orange-500 rounded-full border-t-transparent -rotate-45"></div>
            </div>
            <p className="text-sm text-slate-300">
                To lose weight, you must be in a <strong className="text-emerald-400">Caloric Deficit</strong>.
                <br />
                Exercise increases BMR temporarily.
            </p>
        </div>
    </div>
);

const GlucoseSim = () => {
    // Generate Graph Data for a spike and crash
    const data = [
        { t: 0, v: 80 }, { t: 1, v: 85 }, { t: 2, v: 90 }, // Normal
        { t: 3, v: 140 }, { t: 4, v: 160 }, { t: 5, v: 150 }, // Spike (Sugar)
        { t: 6, v: 110 }, { t: 7, v: 80 }, { t: 8, v: 60 }, // Crash (Insulin)
        { t: 9, v: 70 }, { t: 10, v: 80 }, // Recovery
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Blood Glucose Regulation</h3>
                <div className="flex gap-4 text-xs font-bold">
                    <span className="text-emerald-400 flex items-center gap-1"><Activity size={12} /> Normal Range (70-120 mg/dL)</span>
                </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="t" hide />
                        <YAxis domain={[40, 180]} hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} labelStyle={{ display: 'none' }} />
                        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Hypoglycemia', fill: '#ef4444', fontSize: 10 }} />
                        <ReferenceLine y={120} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'High', fill: '#10b981', fontSize: 10 }} />
                        <Area type="monotone" dataKey="v" stroke="#f59e0b" fillOpacity={1} fill="url(#colorG)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Annotations overlay */}
                <div className="absolute top-10 left-1/3 text-xs text-white bg-slate-800 px-2 py-1 rounded border border-slate-600">Sugar Intake</div>
                <div className="absolute bottom-10 right-1/4 text-xs text-red-300 bg-red-900/50 px-2 py-1 rounded border border-red-500/30">Hypoglycemia Crash</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-bold text-red-400 flex items-center gap-2">Hypoglycemia (Low)</h4>
                    <ul className="text-xs text-slate-300 mt-2 space-y-1 list-disc pl-4">
                        <li>Caused by: Skipping meals, Insulin spike.</li>
                        <li>Symptoms: Shaking, Sweating, Confusion, Fainting.</li>
                        <li><strong>Pilot Action:</strong> Eat complex carbs immediately.</li>
                    </ul>
                </div>
                <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-lg">
                    <h4 className="font-bold text-orange-400 flex items-center gap-2">Hyperglycemia (High)</h4>
                    <ul className="text-xs text-slate-300 mt-2 space-y-1 list-disc pl-4">
                        <li>Caused by: Diabetes, Stress.</li>
                        <li>Effect: Long term damage.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const BMICalculator = () => {
    const [height, setHeight] = useState(180);
    const [weight, setWeight] = useState(75);

    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
    const bmiNum = Number(bmi);

    let status = 'Normal';
    let color = 'text-emerald-400';
    if (bmiNum < 18.5) { status = 'Underweight'; color = 'text-blue-400'; }
    else if (bmiNum >= 25 && bmiNum < 30) { status = 'Overweight'; color = 'text-yellow-400'; }
    else if (bmiNum >= 30) { status = 'Obese'; color = 'text-red-500'; }

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Interactive BMI</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between text-sm text-slate-300 mb-2">
                                Weight
                                <span className="font-bold text-white">{weight} kg</span>
                            </label>
                            <input
                                type="range"
                                min="40"
                                max="150"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg accent-orange-500"
                            />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm text-slate-300 mb-2">
                                Height
                                <span className="font-bold text-white">{height} cm</span>
                            </label>
                            <input
                                type="range"
                                min="140"
                                max="220"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg accent-orange-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-xs text-slate-400">
                    <p>
                        BMI is a crude measure. Muscle mass is denser than fat, so athletic pilots may have a "high" BMI but be healthy.
                    </p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
                <div className="text-6xl font-black text-white mb-2">{bmi}</div>
                <div className={`text-xl font-bold ${color} uppercase tracking-wider mb-6`}>{status}</div>

                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="w-[18.5%] bg-blue-500 h-full" title="Underweight"></div>
                    <div className="w-[26.5%] bg-emerald-500 h-full" title="Normal"></div>
                    <div className="w-[20%] bg-yellow-500 h-full" title="Overweight"></div>
                    <div className="w-[35%] bg-red-500 h-full" title="Obese"></div>
                </div>
                <div className="flex justify-between w-full text-[10px] text-slate-500 mt-1 font-mono">
                    <span>0</span>
                    <span className="pl-8">18.5</span>
                    <span className="pl-8">25</span>
                    <span className="pl-4">30</span>
                    <span>max</span>
                </div>
            </div>
        </div>
    );
};

export default HPLMetabolism;
