
import React, { useState } from 'react';
import { Radiation, Sun, Moon, AlertTriangle } from 'lucide-react';

const HPLRadiation: React.FC = () => {
    const [tab, setTab] = useState<'types' | 'dose' | 'ozone'>('types');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Radiation className="text-yellow-400" />
                        Radiation & Environment (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Cosmic Radiation, Solar Flares, and Ozone.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('types')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'types' ? 'bg-yellow-600 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Types</button>
                    <button onClick={() => setTab('dose')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'dose' ? 'bg-yellow-600 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Dose Calc</button>
                    <button onClick={() => setTab('ozone')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'ozone' ? 'bg-yellow-600 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Ozone</button>
                </div>
            </div>

            {tab === 'types' && <RadiationTypes />}
            {tab === 'dose' && <DoseCalculator />}
            {tab === 'ozone' && <OzoneToxicity />}
        </div>
    );
};

const RadiationTypes = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Moon className="text-blue-300" /> Galactic Cosmic Radiation
            </h3>
            <p className="text-sm text-slate-300 mb-4">
                Originates from outside the solar system (exploding stars etc.).
            </p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Constant low-level stream.</li>
                <li>High energy particles.</li>
                <li><strong>Max effect:</strong> At the Poles (Magnetic field funnels them in) and High Altitude (Less atmosphere shielding).</li>
            </ul>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sun className="text-orange-400" /> Solar Radiation
            </h3>
            <p className="text-sm text-slate-300 mb-4">
                Originates from the Sun.
            </p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Usually low energy (Solar Wind), blocked by magnetosphere.</li>
                <li><strong>Solar Flares (SPE):</strong> Sudden bursts of intense radiation. Can require descent to lower altitudes to use atmosphere as shield.</li>
                <li>Sun spot cycle: ~11 years.</li>
            </ul>
        </div>
    </div>
);

const DoseCalculator = () => {
    const [hours, setHours] = useState(500);
    const [flightLevel, setFlightLevel] = useState(350);

    // Crude approximation: 
    // Sea level = 0.0001 mSv/hr
    // FL300 = 0.003
    // FL400 = 0.008
    const doseRate = 0.0001 * Math.pow(1.15, (flightLevel / 2000));
    const totalDose = doseRate * hours;

    // Limits
    // Public: 1 mSv/yr
    // Aircrew: 20 mSv/yr (EASA limit is effectively monitored >6, limit 20)
    // Pregnant: 1 mSv for remainder of pregnancy.

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6">Dose Estimator (Sieverts)</h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="flex justify-between text-xs text-slate-400 mb-2">
                            Annual Flight Hours
                            <span className="text-white font-mono">{hours} hrs</span>
                        </label>
                        <input type="range" min="0" max="1000" value={hours} onChange={e => setHours(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg accent-yellow-500" />
                    </div>

                    <div>
                        <label className="flex justify-between text-xs text-slate-400 mb-2">
                            Avg Flight Level
                            <span className="text-white font-mono">FL {flightLevel}</span>
                        </label>
                        <input type="range" min="0" max="500" step="10" value={flightLevel} onChange={e => setFlightLevel(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg accent-yellow-500" />
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Annual Dose</p>
                    <div className={`text-4xl font-black mb-2 ${totalDose > 6 ? 'text-red-500' : totalDose > 1 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {totalDose.toFixed(2)} mSv
                    </div>
                    <p className="text-xs text-center text-slate-400">
                        {totalDose > 6
                            ? "Classified Worker Level. Requires medical monitoring."
                            : totalDose > 1
                                ? "Above Public Limit (1mSv). Normal for Aircrew."
                                : "Negligible."}
                    </p>

                    <div className="mt-4 w-full bg-slate-800 p-3 rounded text-xs">
                        <p className="text-slate-300"><strong>Pregnant Crew:</strong> Limit is 1 mSv for remainder of gestation. (Usually grounded or ground duties).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OzoneToxicity = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Ozone (O3)</h3>

        <div className="flex gap-4 items-start bg-slate-900 p-6 rounded-xl border border-slate-700">
            <AlertTriangle className="text-blue-400 shrink-0 mt-1" size={32} />
            <div>
                <h4 className="font-bold text-white mb-2">High Altitude Pollutant</h4>
                <p className="text-sm text-slate-300 mb-4">
                    O3 is toxic. It is found in high concentrations in the Stratosphere (Ozone Layer).
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm bg-slate-800 p-4 rounded-lg">
                    <div>
                        <strong className="text-blue-400 block mb-1">Occurrence:</strong>
                        <ul className="text-slate-400 list-disc pl-4 text-xs">
                            <li>Higher Latitudes (Poles).</li>
                            <li>Winter / Spring.</li>
                            <li>Altitudes &gt; 40,000ft.</li>
                        </ul>
                    </div>
                    <div>
                        <strong className="text-red-400 block mb-1">Symptoms:</strong>
                        <ul className="text-slate-400 list-disc pl-4 text-xs">
                            <li>Chest pain / Coughing.</li>
                            <li>Shortness of breath.</li>
                            <li>Eye/Nose irritation.</li>
                        </ul>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mt-4">
                    Note: Modern jets have catalytic converters in the bleed air system to break O3 down into O2.
                </p>
            </div>
        </div>
    </div>
);

export default HPLRadiation;
