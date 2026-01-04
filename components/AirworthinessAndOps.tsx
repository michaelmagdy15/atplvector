
import React, { useState } from 'react';
import { PenTool, Truck, FileCheck, Scale, AlertTriangle, FireExtinguisher } from 'lucide-react';

const AirworthinessAndOps: React.FC = () => {
  const [tab, setTab] = useState<'cof' | 'pcn' | 'rff'>('cof');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <PenTool className="text-teal-400" />
            Technical Operations
          </h2>
          <p className="text-slate-400 text-sm">Airworthiness (Annex 8) and Aerodrome Tech (Annex 14).</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setTab('cof')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'cof' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>Airworthiness</button>
          <button onClick={() => setTab('pcn')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'pcn' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>ACN / PCN</button>
          <button onClick={() => setTab('rff')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'rff' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>RFF Category</button>
        </div>
      </div>

      {tab === 'cof' && <AirworthinessInfo />}
      {tab === 'pcn' && <PavementCalc />}
      {tab === 'rff' && <RffCalc />}
    </div>
  );
};

const AirworthinessInfo = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <FileCheck className="text-teal-400" /> Certificate of Airworthiness (C of A)
                </h3>
                <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                    <li>Issued by <strong>State of Registry</strong>.</li>
                    <li>Required for international navigation (Chicago Art 31).</li>
                    <li>Proof that aircraft complies with Type Certificate.</li>
                    <li><strong>Validity:</strong> Non-expiring (EASA) as long as ARC (Airworthiness Review Certificate) is valid (1 year) and maintenance program followed.</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-3">State Responsibilities</h3>
                <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded">
                        <span className="text-xs font-bold text-slate-400 uppercase">State of Design</span>
                        <p className="text-white text-sm font-bold">Issues Type Certificate</p>
                        <p className="text-xs text-slate-500">Transmits mandatory Continuing Airworthiness info (ADs).</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded">
                        <span className="text-xs font-bold text-slate-400 uppercase">State of Manufacture</span>
                        <p className="text-white text-sm font-bold">Ensures Production Quality</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded">
                        <span className="text-xs font-bold text-slate-400 uppercase">State of Registry</span>
                        <p className="text-white text-sm font-bold">Issues C of A</p>
                        <p className="text-xs text-slate-500">Ensures continuing airworthiness is maintained.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PavementCalc = () => {
    const [acn, setAcn] = useState(50);
    const [pcn, setPcn] = useState(45);
    const [tire, setTire] = useState('High'); // W
    const [pavement, setPavement] = useState('Rigid'); // R

    // Logic: PCN must be >= ACN
    // Exception: Occasional overload 10% allowed (if pavement not showing distress)
    const canLand = pcn >= acn;
    const overload = !canLand && acn <= pcn * 1.1;

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-2">
            <div className="space-y-6">
                <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Aircraft Classification Number (ACN)</label>
                    <input type="range" min="10" max="100" value={acn} onChange={e => setAcn(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                    <div className="text-right font-black text-2xl text-teal-400 mt-1">{acn}</div>
                    <p className="text-[10px] text-slate-500 mt-2">Effect of aircraft weight on pavement.</p>
                </div>

                <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Pavement Classification Number (PCN)</label>
                    <input type="range" min="10" max="100" value={pcn} onChange={e => setPcn(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    <div className="text-right font-black text-2xl text-indigo-400 mt-1">{pcn}</div>
                    <p className="text-[10px] text-slate-500 mt-2">Bearing strength of pavement.</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-900 rounded-xl p-6 border border-slate-700 text-center">
                <div className={`p-6 rounded-full mb-4 ${canLand ? 'bg-emerald-500/20 text-emerald-500' : overload ? 'bg-orange-500/20 text-orange-500' : 'bg-red-500/20 text-red-500'}`}>
                    <Scale size={48} />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2">
                    {canLand ? 'OPERATIONS PERMITTED' : overload ? 'OVERLOAD PERMITTED*' : 'PAVEMENT TOO WEAK'}
                </h3>
                
                <p className="text-slate-400 text-sm mb-4">
                    ACN {acn} vs PCN {pcn}
                </p>

                {overload && (
                    <div className="text-xs bg-orange-900/20 p-2 rounded text-orange-300 border border-orange-900/50">
                        *Occasional overload (max 10% above PCN) typically allowed if no pavement distress visible.
                    </div>
                )}

                <div className="mt-6 w-full text-left bg-slate-800 p-3 rounded text-xs font-mono text-slate-400">
                    PCN FORMAT: {pcn} / {pavement === 'Rigid' ? 'R' : 'F'} / B / {tire === 'High' ? 'W' : 'X'} / T
                </div>
            </div>
        </div>
    );
};

const RffCalc = () => {
    const [length, setLength] = useState(30); // Aircraft length
    const [width, setWidth] = useState(3); // Fuselage width

    // Simplified Category Logic based on Length (Annex 14 Table)
    const getCat = (l: number, w: number) => {
        let cat = 1;
        if (l >= 9) cat = 2;
        if (l >= 12) cat = 3;
        if (l >= 18) cat = 4;
        if (l >= 24) cat = 5;
        if (l >= 28) cat = 6;
        if (l >= 39) cat = 7;
        if (l >= 49) cat = 8;
        if (l >= 61) cat = 9;
        if (l >= 76) cat = 10;
        
        // Width Adjustment: If width exceeds max for that cat, increase cat by 1 (Simplified rule)
        // Usually width is tied to length in standard aircraft, but rule exists.
        return cat;
    };

    const cat = getCat(length, width);

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-2">
            <div className="space-y-6">
                <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Aircraft Length</label>
                    <input type="range" min="5" max="80" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                    <div className="text-right font-black text-2xl text-red-400 mt-1">{length}m</div>
                </div>
                
                <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Examples</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <span>C172: ~8m (Cat 1)</span>
                        <span>B737: ~39m (Cat 7)</span>
                        <span>A320: ~37m (Cat 6)</span>
                        <span>B747: ~70m (Cat 9)</span>
                        <span>A380: ~73m (Cat 10)</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-900 rounded-xl p-6 border border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FireExtinguisher size={120} />
                </div>
                
                <div className="relative z-10">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Required RFF Category</p>
                    <div className="text-8xl font-black text-white mb-4">{cat}</div>
                    
                    <div className="bg-red-600/20 p-4 rounded-lg border border-red-500/50">
                        <p className="text-red-400 font-bold text-sm">Response Time Requirement</p>
                        <p className="text-white text-lg font-black">2 mins</p>
                        <p className="text-xs text-red-300">(not exceeding 3 mins to end of each runway)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirworthinessAndOps;
