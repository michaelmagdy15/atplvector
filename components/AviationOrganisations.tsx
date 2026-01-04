
import React, { useState } from 'react';
import { Globe, Users, BookOpen, Activity, ArrowRight, ShieldCheck, Database, Sliders } from 'lucide-react';

const AviationOrganisations: React.FC = () => {
  const [tab, setTab] = useState<'icao' | 'easa' | 'eurocontrol'>('icao');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="text-blue-400" />
            International Organisations
          </h2>
          <p className="text-slate-400 text-sm">Structure and objectives of ICAO, EASA, and Eurocontrol.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setTab('icao')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'icao' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>ICAO</button>
          <button onClick={() => setTab('easa')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'easa' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>EASA</button>
          <button onClick={() => setTab('eurocontrol')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'eurocontrol' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Eurocontrol</button>
        </div>
      </div>

      {tab === 'icao' && <IcaoStructure />}
      {tab === 'easa' && <EasaRole />}
      {tab === 'eurocontrol' && <EurocontrolRole />}
    </div>
  );
};

const IcaoStructure = () => (
    <div className="space-y-8 animate-in fade-in">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <Users size={32} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-bold text-white mb-2">The Assembly</h3>
                <p className="text-xs text-slate-400 font-mono mb-4 uppercase font-bold">SOVEREIGN BODY</p>
                <ul className="text-sm text-slate-300 text-left space-y-2 list-disc pl-4">
                    <li>Meets every 3 years.</li>
                    <li>All 193 Member States have 1 vote.</li>
                    <li>Approves budget & elects Council.</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                <Globe size={32} className="mx-auto mb-4 text-indigo-400" />
                <h3 className="text-xl font-bold text-white mb-2">The Council</h3>
                <p className="text-xs text-slate-400 font-mono mb-4 uppercase font-bold">GOVERNING BODY</p>
                <ul className="text-sm text-slate-300 text-left space-y-2 list-disc pl-4">
                    <li>Permanent body.</li>
                    <li>36 Contracting States elected by Assembly.</li>
                    <li>Adopts SARPs (Annexes).</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <BookOpen size={32} className="mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">ANC</h3>
                <p className="text-xs text-slate-400 font-mono mb-4 uppercase font-bold">AIR NAV COMMISSION</p>
                <ul className="text-sm text-slate-300 text-left space-y-2 list-disc pl-4">
                    <li>Technical experts (not politicians).</li>
                    <li>19 members appointed by Council.</li>
                    <li>Develops technical standards.</li>
                </ul>
            </div>
        </div>

        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">ICAO HQ & Regions</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <p className="text-sm text-slate-300 mb-4">
                        Headquarters: <span className="font-bold text-white">Montreal, Canada</span>. 
                        Regional offices implement regional plans (e.g., EUR/NAT in Paris).
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <span className="bg-slate-800 p-2 rounded">APAC (Bangkok)</span>
                        <span className="bg-slate-800 p-2 rounded">ESAF (Nairobi)</span>
                        <span className="bg-slate-800 p-2 rounded">EUR/NAT (Paris)</span>
                        <span className="bg-slate-800 p-2 rounded">MID (Cairo)</span>
                        <span className="bg-slate-800 p-2 rounded">NACC (Mexico)</span>
                        <span className="bg-slate-800 p-2 rounded">SAM (Lima)</span>
                        <span className="bg-slate-800 p-2 rounded">WACAF (Dakar)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const EasaRole = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4 mb-4">
                <ShieldCheck size={40} className="text-yellow-400" />
                <div>
                    <h3 className="text-xl font-bold text-white">European Union Aviation Safety Agency (EASA)</h3>
                    <p className="text-slate-400 text-sm">Cologne, Germany</p>
                </div>
            </div>
            <p className="text-slate-300 mb-4">
                The centrepiece of EU aviation safety. Responsibilities include drafting legislation (Opinions), Certification, and Standardization.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded border-l-4 border-yellow-400">
                    <h4 className="font-bold text-white text-sm mb-1">EASA Responsibilities</h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                        <li>Type Certification of aircraft/engines.</li>
                        <li>Approval of Design Orgs (DOA).</li>
                        <li>Drafting Implementing Rules (Hard Law).</li>
                        <li>Standardization inspections of NAAs.</li>
                    </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-slate-500">
                    <h4 className="font-bold text-white text-sm mb-1">National Authority (NAA) Responsibilities</h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                        <li>Issuing individual pilot licenses.</li>
                        <li>Issuing individual Certificates of Airworthiness.</li>
                        <li>Oversight of national airlines (AOC).</li>
                        <li>Approving Production Orgs (POA) - usually.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded text-center">
                <p className="text-xs text-slate-400 uppercase font-bold">Hard Law</p>
                <p className="text-white font-bold">Implementing Rules (IR)</p>
                <p className="text-[10px] text-slate-500 mt-1">Legally binding regulations</p>
            </div>
            <div className="bg-slate-800 p-4 rounded text-center">
                <p className="text-xs text-slate-400 uppercase font-bold">Soft Law</p>
                <p className="text-white font-bold">AMC & GM</p>
                <p className="text-[10px] text-slate-500 mt-1">Acceptable Means of Compliance</p>
            </div>
            <div className="bg-slate-800 p-4 rounded text-center">
                <p className="text-xs text-slate-400 uppercase font-bold">Specs</p>
                <p className="text-white font-bold">CS (Cert Specs)</p>
                <p className="text-[10px] text-slate-500 mt-1">e.g., CS-25 for Large Aeroplanes</p>
            </div>
        </div>
    </div>
);

const EurocontrolRole = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4 mb-4">
                <Activity size={40} className="text-sky-400" />
                <div>
                    <h3 className="text-xl font-bold text-white">Eurocontrol</h3>
                    <p className="text-slate-400 text-sm">Brussels, Belgium</p>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-white text-sm mb-3 border-b border-slate-700 pb-1">Network Manager (NM)</h4>
                    <p className="text-sm text-slate-300 mb-4">
                        Manages the ATM network functions (flow management) across Europe.
                    </p>
                    <div className="bg-slate-800 p-3 rounded flex items-start gap-3">
                        <Sliders size={20} className="text-sky-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-bold text-white text-sm">ATFCM (Flow Management)</p>
                            <p className="text-xs text-slate-400">Balances demand with capacity to prevent overloads. Issues slots (CTOT).</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm mb-3 border-b border-slate-700 pb-1">Key Systems</h4>
                    <div className="space-y-2">
                        <div className="bg-slate-800 p-3 rounded flex items-center gap-3">
                            <Database size={20} className="text-sky-400" />
                            <div>
                                <p className="font-bold text-white text-sm">IFPS</p>
                                <p className="text-[10px] text-slate-400">Integrated Initial Flight Plan Processing System. Where flight plans go.</p>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded flex items-center gap-3">
                            <Globe size={20} className="text-sky-400" />
                            <div>
                                <p className="font-bold text-white text-sm">CFMU &rarr; NMOC</p>
                                <p className="text-[10px] text-slate-400">Central Flow Management Unit (Old name). Now Network Manager Ops Centre.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="bg-indigo-900/20 border border-indigo-900/50 p-4 rounded-lg">
            <h4 className="font-bold text-indigo-400 text-sm mb-2">Single European Sky (SES)</h4>
            <p className="text-xs text-slate-300">
                EU initiative to defragment airspace, organize it into Functional Airspace Blocks (FABs) rather than national borders, improving capacity and efficiency.
            </p>
        </div>
    </div>
);

export default AviationOrganisations;
