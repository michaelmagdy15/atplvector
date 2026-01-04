import React, { useState } from 'react';
import { Sun, Radiation, AlertTriangle, ShieldAlert } from 'lucide-react';

const HPLRadiation: React.FC = () => {
    const [tab, setTab] = useState<'types' | 'dose' | 'ozone'>('types');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Radiation className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Cosmic Radiation & Ozone</h1>
                </div>
                <p className="text-slate-400">
                    Ionizing radiation at altitude and the toxic effects of ozone are significant environmental hazards for aircrew.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('types')} className={`flex-1 py-2 rounded transition-colors ${tab === 'types' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Radiation Types</button>
                <button onClick={() => setTab('dose')} className={`flex-1 py-2 rounded transition-colors ${tab === 'dose' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Dose Calculator</button>
                <button onClick={() => setTab('ozone')} className={`flex-1 py-2 rounded transition-colors ${tab === 'ozone' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Ozone</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'types' && <RadiationTypes />}
                {tab === 'dose' && <DoseCalculator />}
                {tab === 'ozone' && <OzoneSim />}
            </div>
        </div>
    );
};

const RadiationTypes = () => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-white">Sources of Ionizing Radiation</h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/20 rounded-full">
                        <Sun className="text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-lg text-white">Galactic Cosmic Radiation</h4>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                    Originates from outside our solar system (supernovae, etc.). It is constant and high-energy.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li>• <strong>Altitude:</strong> Intensity increases with altitude (less atmosphere to shield).</li>
                    <li>• <strong>Latitude:</strong> Intensity increases towards poles (magnetic field funnel).</li>
                    <li>• <strong>Solar Cycle:</strong> Actually <em>lower</em> during Solar Maximum (solar wind deflects it).</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-full">
                        <Radiation className="text-yellow-400" />
                    </div>
                    <h4 className="font-bold text-lg text-white">Solar Cosmic Radiation</h4>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                    Originates from the sun during <strong>Solar Flares</strong> (Coronal Mass Ejections).
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li>• <strong>Predictability:</strong> Sporadic and unpredictable events.</li>
                    <li>• <strong>Warning:</strong> Modern aircraft have radiation monitors.</li>
                    <li>• <strong>Action:</strong> Descend to lower altitude (thicker atmosphere) if alarm sounds.</li>
                </ul>
            </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg text-xs text-slate-300">
            <strong>Sievert (Sv):</strong> The unit of biological effect. <br />
            Aircrew are classified as "occupationally exposed". The annual limit is usually 20 mSv/year (same as nuclear workers), though actual doses are much lower (~2-5 mSv).
        </div>
    </div>
);

const DoseCalculator = () => {
    const [altitude, setAltitude] = useState(30000);
    const [latitude, setLatitude] = useState(45);
    const [hours, setHours] = useState(500);

    // Completely fake formula for demonstration
    // Base dose + Altitude factor + Latitude factor
    const dose = ((altitude / 10000) * (latitude / 90) * (hours / 1000)).toFixed(2);

    // Risk bands
    let risk = 'Low';
    let color = 'text-green-500';
    if (parseFloat(dose) > 2) { risk = 'Moderate'; color = 'text-yellow-500'; }
    if (parseFloat(dose) > 5) { risk = 'High'; color = 'text-red-500'; }

    return (
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div>
                    <label className="block text-slate-300 mb-2 font-medium">Cruise Altitude: <span className="text-white font-bold">{altitude} ft</span></label>
                    <input type="range" min="0" max="60000" step="1000" value={altitude} onChange={(e) => setAltitude(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                    <p className="text-xs text-slate-500 mt-1">Dose doubles every ~2,000 meters.</p>
                </div>
                <div>
                    <label className="block text-slate-300 mb-2 font-medium">Latitude: <span className="text-white font-bold">{latitude}° (N/S)</span></label>
                    <input type="range" min="0" max="90" value={latitude} onChange={(e) => setLatitude(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                    <p className="text-xs text-slate-500 mt-1">0° (Equator) lowest, 90° (Poles) highest.</p>
                </div>
                <div>
                    <label className="block text-slate-300 mb-2 font-medium">Flight Hours/Year: <span className="text-white font-bold">{hours} hrs</span></label>
                    <input type="range" min="0" max="1000" value={hours} onChange={(e) => setHours(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Annual Dose</div>
                <div className="text-5xl font-black text-white mb-2">{dose} <span className="text-2xl text-slate-500 font-medium">mSv</span></div>
                <div className={`text-xl font-bold ${color}`}>{risk} Exposure</div>

                <div className="mt-8 text-left text-xs text-slate-400 space-y-2 bg-black/20 p-4 rounded">
                    <p><strong>Note:</strong> This relies on <em>SIEVERT (Sv)</em>, not Gray (Gy). Sievert accounts for biological damage (Quality Factor).</p>
                    <p>Neutrons (common at altitude) have a high Quality Factor (harmful).</p>
                </div>
            </div>
        </div>
    );
};

const OzoneSim = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Atmospheric Ozone (O3)</h3>
        <p className="text-slate-300">
            Ozone is a toxic gas found in the stratosphere, formed by UV radiation acting on oxygen.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} /> Location & Exposure
                </h4>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">●</span>
                        <span><strong>Highest Concentration:</strong> Stratosphere (above Tropopause).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">●</span>
                        <span><strong>Seasonal Peak:</strong> Spring.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">●</span>
                        <span><strong>Latitude:</strong> Higher concentrations near poles (lower tropopause).</span>
                    </li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-red-300 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} /> Effects & Protection
                </h4>
                <div className="space-y-4">
                    <div>
                        <strong className="text-white text-xs uppercase block mb-1">Symptoms</strong>
                        <p className="text-sm text-slate-400">Irritation of eyes/throat, coughing, chest pain, difficulty breathing.</p>
                    </div>
                    <div>
                        <strong className="text-white text-xs uppercase block mb-1">Aircraft Systems</strong>
                        <p className="text-sm text-slate-400">Modern jets use <strong>Catalytic Converters</strong> in the bleed air system to break O3 down into O2 before it enters the cabin.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HPLRadiation;
