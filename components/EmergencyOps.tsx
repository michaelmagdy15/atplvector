
import React, { useState } from 'react';
import { AlertCircle, Flame, Timer, CloudRain, ShieldAlert } from 'lucide-react';

const EmergencyOps: React.FC = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        { name: 'Fuel Dump', icon: Flame },
        { name: 'TCAS', icon: ShieldAlert },
        { name: 'Distress/Urg', icon: AlertCircle },
        { name: 'Comms Timer', icon: Timer },
        { name: 'Wind Shear', icon: CloudRain },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[600px] flex flex-col text-black">
            <div className="bg-slate-900 p-4 flex overflow-x-auto scrollbar-hide">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => setTab(i)}
                        className={`flex items-center px-4 py-2 rounded-lg mr-2 transition-all whitespace-nowrap ${
                            tab === i ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        <t.icon className="w-4 h-4 mr-2" />
                        {t.name}
                    </button>
                ))}
            </div>
            <div className="p-8 flex-1 bg-slate-50 text-black">
                {tab === 0 && <FuelJettison />}
                {tab === 1 && <TcasResponse />}
                {tab === 2 && <DistressUrgency />}
                {tab === 3 && <LostCommsTimer />}
                {tab === 4 && <WindShearReport />}
            </div>
        </div>
    );
};

// 1. Fuel Jettison (Page 2)
const FuelJettison = () => {
    const [armed, setArmed] = useState(false);
    const [dumping, setDumping] = useState(false);

    return (
        <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Fuel Jettison Procedures</h3>
            
            <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full mb-2 ${armed ? 'bg-green-500 shadow-[0_0_10px_lime]' : 'bg-slate-300'}`}></div>
                    <button 
                        onClick={() => setArmed(!armed)}
                        className={`w-16 h-24 rounded border-4 flex items-center justify-center font-bold text-slate-800 ${armed ? 'bg-slate-200 border-green-600' : 'bg-slate-100 border-slate-300'}`}
                    >
                        ARM
                    </button>
                </div>
                <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full mb-2 ${dumping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-slate-300'}`}></div>
                    <button 
                        onClick={() => armed && setDumping(!dumping)}
                        className={`w-16 h-24 rounded border-4 flex items-center justify-center font-bold text-slate-800 ${dumping ? 'bg-slate-200 border-red-600' : 'bg-slate-100 border-slate-300'}`}
                    >
                        DUMP
                    </button>
                </div>
            </div>

            <div className={`p-6 rounded-xl font-mono transition-all ${dumping ? 'bg-red-100 text-red-900 border-red-200' : 'bg-slate-100 text-slate-500'}`}>
                {dumping ? "PAN-PAN, PAN-PAN, PAN-PAN, ALL STATIONS, FASTAIR 345 FUEL DUMPING COMPLETED." : "Waiting for activation..."}
            </div>
        </div>
    );
};

// 2. TCAS Response (Page 8, 19)
const TcasResponse = () => {
    const [scenario, setScenario] = useState('RA'); // RA or Climb

    return (
        <div className="text-center max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">TCAS Phraseology</h3>
            
            <div className="mb-8">
                <div className="text-xs font-bold uppercase text-slate-500 mb-2">Scenario</div>
                <div className="text-lg font-bold text-slate-900 bg-white p-4 border rounded-xl shadow-sm">
                    {scenario === 'RA' ? "TCAS RA Annunciation" : "ATC Orders Climb, but TCAS says Descend"}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button className="p-3 bg-white border hover:bg-sky-50 rounded text-left font-mono text-sm text-slate-900">"TCAS RA"</button>
                <button className="p-3 bg-white border hover:bg-sky-50 rounded text-left font-mono text-sm text-slate-900">"UNABLE, TCAS RA"</button>
                <button className="p-3 bg-white border hover:bg-sky-50 rounded text-left font-mono text-sm text-slate-900">"CLIMBING"</button>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => setScenario('RA')} className="text-xs font-bold underline text-slate-500 hover:text-slate-800">Scenario 1</button>
                <button onClick={() => setScenario('Conflict')} className="text-xs font-bold underline text-slate-500 hover:text-slate-800">Scenario 2</button>
            </div>
        </div>
    );
};

// 3. Distress vs Urgency (Page 3)
const DistressUrgency = () => {
    const [items, setItems] = useState([
        { id: 1, text: "Engine Fire", type: 'DISTRESS' },
        { id: 2, text: "Sick Passenger", type: 'URGENCY' },
        { id: 3, text: "Lost Position", type: 'URGENCY' },
        { id: 4, text: "Ditching", type: 'DISTRESS' },
    ]);

    const check = (id: number, guess: string) => {
        const item = items.find(i => i.id === id);
        if (item && item.type === guess) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Distress or Urgency?</h3>
            
            <div className="flex justify-center gap-8 mb-8">
                <div className="w-1/3 border-2 border-red-500 rounded-xl p-4 bg-red-50 min-h-[150px]">
                    <h4 className="text-red-700 font-black mb-4">MAYDAY</h4>
                    {items.map(i => (
                        <button key={i.id} onClick={() => check(i.id, 'DISTRESS')} className="block w-full mb-2 p-2 bg-white rounded shadow-sm text-sm font-bold text-slate-900 border border-slate-200 hover:bg-slate-50">{i.text}</button>
                    ))}
                </div>
                <div className="w-1/3 border-2 border-orange-500 rounded-xl p-4 bg-orange-50 min-h-[150px]">
                    <h4 className="text-orange-700 font-black mb-4">PAN-PAN</h4>
                    {items.map(i => (
                        <button key={i.id} onClick={() => check(i.id, 'URGENCY')} className="block w-full mb-2 p-2 bg-white rounded shadow-sm text-sm font-bold text-slate-900 border border-slate-200 hover:bg-slate-50">{i.text}</button>
                    ))}
                </div>
            </div>
            {items.length === 0 && <div className="text-green-600 font-bold">All Sorted!</div>}
        </div>
    );
};

// 4. Lost Comms Timer (Page 17)
const LostCommsTimer = () => {
    const [surveillance, setSurveillance] = useState(true);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">IMC Comms Failure</h3>
            
            <div className="flex justify-center mb-8">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={surveillance} onChange={e => setSurveillance(e.target.checked)} className="w-5 h-5 accent-sky-600" />
                    <span className="font-bold text-slate-700">Under ATS Surveillance?</span>
                </label>
            </div>

            <div className="relative h-20 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-500 ${surveillance ? 'w-1/3 bg-orange-500' : 'w-2/3 bg-red-500'}`}
                >
                    {surveillance ? "7 MIN" : "20 MIN"}
                </div>
            </div>
            <p className="mt-4 text-slate-500">Maintain Speed & Level for this duration, then proceed via Flight Plan.</p>
        </div>
    );
};

// 5. Wind Shear Report (Page 9)
const WindShearReport = () => {
    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Wind Shear Alert</h3>
            <button className="w-64 h-64 bg-slate-100 rounded-full border-4 border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all group flex flex-col items-center justify-center">
                <CloudRain className="w-16 h-16 text-slate-400 group-hover:text-red-500 mb-4" />
                <span className="font-bold text-slate-500 group-hover:text-red-600">REPORT WIND SHEAR</span>
            </button>
            <div className="mt-6 p-4 bg-red-100 text-red-900 rounded-lg border border-red-200 font-mono font-bold">
                "WIND SHEAR WARNING, ALL RUNWAYS."
            </div>
        </div>
    );
};

export default EmergencyOps;
