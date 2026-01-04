
import React, { useState } from 'react';
import { Radio, Wifi, Database, Activity, Volume2, Send, Server } from 'lucide-react';

const NavDataLink: React.FC = () => {
  const [tab, setTab] = useState<'idents' | 'acars'>('idents');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 mt-8 text-slate-900 min-h-[600px] flex flex-col">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Radio className="text-sky-400" /> Nav Aids & Data Link
            </h2>
            <p className="text-slate-400 text-sm">Morse Identities & ACARS/CPDLC Protocols.</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg">
            <button 
                onClick={() => setTab('idents')} 
                className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${tab === 'idents' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <Activity size={16} /> Ident
            </button>
            <button 
                onClick={() => setTab('acars')} 
                className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${tab === 'acars' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <Wifi size={16} /> ACARS
            </button>
        </div>
      </div>

      <div className="p-8 flex-1 bg-slate-50">
        {tab === 'idents' && <NavIdents />}
        {tab === 'acars' && <AcarsSystem />}
      </div>
    </div>
  );
};

const NavIdents = () => {
    const aids = [
        { type: 'VOR', freq: '1020 Hz', rate: '3 letter code, every 10s', pitch: 'Medium', desc: 'Voice often superimposed.' },
        { type: 'DME', freq: '1350 Hz', rate: 'Every 30s (synced with VOR)', pitch: 'High', desc: 'Sharper tone. If VOR/DME associated, DME ident 1 time for every 3 VOR idents.' },
        { type: 'ILS', freq: '1020 Hz', rate: 'Approx 6 times per min', pitch: 'Medium', desc: 'Continuous repeating.' },
        { type: 'NDB', freq: '1020/400 Hz', rate: '2 or 3 letter code', pitch: 'Variable', desc: 'Can be keyed on/off.' }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Morse Code Identification</h3>
                <p className="text-slate-600">Pilots must verify the identity of navigation aids by listening to the Morse code identifier.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {aids.map((aid) => (
                    <div key={aid.type} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-2xl font-black text-slate-800">{aid.type}</h4>
                            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-sky-50 transition-colors">
                                <Volume2 className="text-slate-400 group-hover:text-sky-500" />
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-bold">Tone Frequency</span>
                                <span className="font-mono text-slate-900">{aid.freq}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-bold">Pitch</span>
                                <span className="font-mono text-slate-900">{aid.pitch}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <span className="text-slate-500 font-bold text-xs uppercase block mb-1">Repetition Rate</span>
                                <p className="text-slate-700">{aid.rate}</p>
                            </div>
                            <p className="text-xs text-slate-400 italic mt-2">{aid.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 flex items-start gap-4">
                <Activity className="text-sky-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sky-800 mb-1">DME/VOR Synchronization</h4>
                    <p className="text-sm text-sky-700">
                        When a VOR and DME are associated (same location/frequency pairing), their idents are synchronized. 
                        You will typically hear the VOR ident 3 times, followed by the DME ident once. 
                        The DME tone is higher pitched (1350 Hz vs 1020 Hz).
                    </p>
                </div>
            </div>
        </div>
    );
};

const AcarsSystem = () => {
    const [messages, setMessages] = useState<{from: string, text: string, time: string}[]>([
        { from: 'COMPANY', text: 'WX REPORT LONDON: CAVOK', time: '10:05' },
        { from: 'ACARS', text: 'LINK ESTABLISHED', time: '09:58' }
    ]);
    const [oooi, setOooi] = useState('OUT');

    const handleSend = () => {
        setMessages(prev => [{ from: 'AIRCRAFT', text: 'REQUEST GATE ASSIGNMENT', time: '10:12' }, ...prev]);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full">
            {/* MCDU / Screen */}
            <div className="w-full md:w-1/2 bg-slate-800 p-4 rounded-xl border-4 border-slate-700 shadow-2xl flex flex-col">
                <div className="bg-slate-900 flex-1 rounded border-2 border-slate-600 p-4 font-mono text-green-500 overflow-y-auto mb-4 min-h-[300px]">
                    <div className="border-b border-green-500/30 pb-2 mb-4 flex justify-between">
                        <span>ACARS MENU</span>
                        <span>{oooi}</span>
                    </div>
                    
                    <div className="space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className="text-xs">
                                <div className="text-green-700 mb-1">{m.time} {m.from}</div>
                                <div className="text-green-400 font-bold">{m.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleSend} className="bg-slate-700 text-white p-3 rounded font-bold hover:bg-slate-600 flex items-center justify-center gap-2 text-sm">
                        <Send size={16} /> SEND MSG
                    </button>
                    <div className="bg-slate-900 text-slate-500 p-3 rounded flex items-center justify-center text-xs">
                        DATA MODE
                    </div>
                </div>
            </div>

            {/* Explanations */}
            <div className="w-full md:w-1/2 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">OOOI Phases</h3>
                    <p className="text-sm text-slate-600 mb-4">ACARS automatically detects flight phase triggers:</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setOooi('OUT')}
                            className={`p-3 rounded border text-center transition-all ${oooi === 'OUT' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="block text-xs font-bold opacity-70">1. OUT</span>
                            <span className="text-[10px]">Brakes Rel / Doors Closed</span>
                        </button>
                        <button 
                            onClick={() => setOooi('OFF')}
                            className={`p-3 rounded border text-center transition-all ${oooi === 'OFF' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="block text-xs font-bold opacity-70">2. OFF</span>
                            <span className="text-[10px]">Weight Off Wheels</span>
                        </button>
                        <button 
                            onClick={() => setOooi('ON')}
                            className={`p-3 rounded border text-center transition-all ${oooi === 'ON' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="block text-xs font-bold opacity-70">3. ON</span>
                            <span className="text-[10px]">Weight On Wheels</span>
                        </button>
                        <button 
                            onClick={() => setOooi('IN')}
                            className={`p-3 rounded border text-center transition-all ${oooi === 'IN' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="block text-xs font-bold opacity-70">4. IN</span>
                            <span className="text-[10px]">Brakes Set / Door Open</span>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                        <Database size={16} /> ACARS vs CPDLC
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                        <li><strong>ACARS:</strong> Aircraft Communications Addressing and Reporting System. Primarily for Company ops (OOOI, Tech logs, Loadsheets, Weather). Uses VHF/HF/Sat.</li>
                        <li><strong>CPDLC:</strong> Controller Pilot Data Link Communications. Used for ATC instructions (Clearances, Frequency changes). Replaces voice for routine comms.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavDataLink;
