
import React, { useState } from 'react';
import { CheckSquare, Map, Volume2, Hash, BookOpen } from 'lucide-react';

const FlightRules: React.FC = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        { name: 'Readback', icon: CheckSquare },
        { name: 'Clearance Limit', icon: Map },
        { name: 'Selcal', icon: Volume2 },
        { name: 'Callsign', icon: Hash },
        { name: 'Broadcast', icon: BookOpen },
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
                {tab === 0 && <ReadbackItems />}
                {tab === 1 && <ClearanceLimit />}
                {tab === 2 && <SelcalSim />}
                {tab === 3 && <CallsignAbbr />}
                {tab === 4 && <BroadcastBlind />}
            </div>
        </div>
    );
};

// 1. Readback Items (Page 7)
const ReadbackItems = () => {
    const [checked, setChecked] = useState<string[]>([]);
    
    const items = [
        { id: '1', text: 'ATC Route Clearances', req: true },
        { id: '2', text: 'Altimeter Settings', req: true },
        { id: '3', text: 'Wind Information', req: false },
        { id: '4', text: 'SSR Codes', req: true },
        { id: '5', text: 'Takeoff Clearance', req: true },
        { id: '6', text: 'Time Check', req: false },
    ];

    const toggle = (id: string) => {
        if (checked.includes(id)) setChecked(checked.filter(c => c !== id));
        else setChecked([...checked, id]);
    };

    return (
        <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Mandatory Readback Items</h3>
            <p className="text-slate-600 mb-6 text-center text-sm">Select items that MUST be read back.</p>
            
            <div className="space-y-2">
                {items.map(item => {
                    const isChecked = checked.includes(item.id);
                    const isCorrect = isChecked === item.req;
                    return (
                        <div key={item.id} onClick={() => toggle(item.id)} className={`p-4 bg-white border rounded-lg cursor-pointer flex justify-between items-center text-slate-900 font-medium ${isChecked ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-slate-200'}`}>
                            <span>{item.text}</span>
                            {isChecked && <CheckSquare className={`w-5 h-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// 2. Clearance Limit (Page 6/11)
const ClearanceLimit = () => {
    const [pos, setPos] = useState(0);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Clearance Limit</h3>
            <p className="text-slate-600 mb-4">"TAXI TO HOLDING POINT A1"</p>
            
            <div className="relative w-full h-64 bg-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="absolute top-1/2 left-0 w-full h-8 bg-slate-400"></div> {/* Taxiway */}
                <div className="absolute top-1/2 left-20 w-4 h-8 bg-yellow-400"></div> {/* Hold A1 */}
                <div className="absolute top-1/2 left-60 w-4 h-8 bg-yellow-400"></div> {/* Hold A2 */}
                
                <div className="absolute top-12 left-18 text-xs font-bold text-slate-600">A1</div>
                <div className="absolute top-12 left-58 text-xs font-bold text-slate-600">A2</div>

                {/* Plane */}
                <div 
                    className="absolute top-[calc(50%-12px)] transition-all duration-1000 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ left: `${pos}%` }}
                >
                    ✈️
                </div>
            </div>

            <button onClick={() => setPos(15)} className="px-6 py-2 bg-slate-800 text-white rounded mr-2">Taxi to A1</button>
            <button onClick={() => setPos(55)} className="px-6 py-2 bg-slate-800 text-white rounded">Taxi to A2</button>
        </div>
    );
};

// 3. SELCAL Sim (Page 8)
const SelcalSim = () => {
    const [code, setCode] = useState("");
    const [status, setStatus] = useState("Standby");

    return (
        <div className="text-center max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">SELCAL Check</h3>
            
            <div className="bg-black p-6 rounded-lg mb-6 border-4 border-slate-600">
                <div className="text-green-500 font-mono text-4xl tracking-widest uppercase">{code || "----"}</div>
                <div className="text-xs text-slate-500 mt-2 font-mono">{status}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {['A','B','C','D','E','F','G','H'].map(l => (
                    <button key={l} onClick={() => setCode(prev => (prev + l).slice(0,4))} className="p-2 bg-slate-200 text-slate-900 rounded font-bold hover:bg-slate-300">{l}</button>
                ))}
            </div>
            
            <div className="flex gap-2">
                <button onClick={() => setCode("")} className="flex-1 py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200">CLR</button>
                <button 
                    onClick={() => {
                        setStatus("CHECKING...");
                        setTimeout(() => setStatus("SELCAL OK"), 1000);
                    }} 
                    className="flex-1 py-2 bg-sky-600 text-white rounded font-bold hover:bg-sky-500"
                >
                    SEND
                </button>
            </div>
        </div>
    );
};

// 4. Callsign Abbr (Page 7)
const CallsignAbbr = () => {
    return (
        <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Abbreviated Callsigns</h3>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Registration</div>
                <div className="text-2xl font-black text-slate-900">G-ABCD</div>
                <div className="my-2 text-slate-400">↓</div>
                <div className="text-2xl font-black text-sky-600">G-CD</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Company</div>
                <div className="text-2xl font-black text-slate-900">FASTAIR G-ABCD</div>
                <div className="my-2 text-slate-400">↓</div>
                <div className="text-2xl font-black text-sky-600">FASTAIR CD</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Flight ID</div>
                <div className="text-2xl font-black text-slate-900">FASTAIR 345</div>
                <div className="my-2 text-slate-400">↓</div>
                <div className="text-2xl font-black text-red-600">NO ABBREVIATION</div>
            </div>
        </div>
    );
};

// 5. Broadcast vs Blind (Page 6)
const BroadcastBlind = () => {
    const [view, setView] = useState('BROADCAST');

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Transmission Types</h3>
            
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => setView('BROADCAST')} className={`px-4 py-2 rounded font-bold ${view === 'BROADCAST' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-800'}`}>BROADCAST</button>
                <button onClick={() => setView('BLIND')} className={`px-4 py-2 rounded font-bold ${view === 'BLIND' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-800'}`}>BLIND TX</button>
            </div>

            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 min-h-[200px] flex items-center justify-center">
                {view === 'BROADCAST' ? (
                    <p className="text-lg text-slate-800">"Transmission of information relating to air navigation that is <span className="font-bold">not addressed to a specific station</span>."</p>
                ) : (
                    <p className="text-lg text-slate-800">"Transmission from one station to another where <span className="font-bold">two-way communication cannot be established</span>, but it is believed the called station is receiving."</p>
                )}
            </div>
        </div>
    );
};

export default FlightRules;
