import React from 'react';
import { Calendar, CheckCircle, GraduationCap, Clock, AlertTriangle } from 'lucide-react';

const TrainingTracker: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Training & Qualification</h2>
                    <p className="text-slate-400 text-sm">Validity periods for commercial operations.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TrainCard
                    title="LPC"
                    subtitle="License Proficiency Check"
                    validity="12 Months"
                    details="Basic flying skills, emergency procedures, IFR."
                    icon={CheckCircle}
                    color="blue"
                />
                <TrainCard
                    title="OPC"
                    subtitle="Operator Proficiency Check"
                    validity="6 Months"
                    valSuffix="+ Remainder of Month"
                    details="Operator specific procedures. Includes RTO, OEI Approches."
                    icon={CheckCircle}
                    color="green"
                />
                <TrainCard
                    title="Line Check"
                    subtitle="Route Competency"
                    validity="12 Months"
                    details="Normal operations competence. CRM assessment."
                    icon={Map} // Just reusing a generic icon or fix below
                    color="purple"
                />
            </div>

            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    Recent Experience Requirements
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Standard Recency</div>
                            <div className="font-black text-2xl text-white">3 Take-offs & Landings</div>
                            <div className="text-sm text-slate-400">Within the last 90 days.</div>
                            <div className="text-xs text-slate-500 mt-2"> Must be on same type/class or Simulator.</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 relative overflow-hidden">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Extension Rules</div>
                            <ul className="text-sm text-slate-300 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span>
                                    Can be extended to 120 days if flying with a TRI/TRE.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">•</span>
                                    &gt; 120 days requires a Training Flight or Simulator session.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Zero Flight Time Training (ZFTT)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div className="bg-slate-900 p-4 rounded border-l-4 border-yellow-500">
                        <span className="font-bold block text-white mb-1">Prerequisite</span>
                        Solely in the simulator. Requires specific approval.
                    </div>
                    <div className="bg-slate-900 p-4 rounded border-l-4 border-yellow-500">
                        <span className="font-bold block text-white mb-1">Post-Course Actions</span>
                        Supervised line flying within 21 days. First 4 landings on line with TRI.
                    </div>
                </div>
            </div>
        </div>
    );
};

const Map = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
);


const TrainCard = ({ title, subtitle, validity, valSuffix, details, icon: Icon, color }: any) => {
    const colors: any = {
        blue: "bg-blue-500",
        green: "bg-emerald-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500"
    };

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group hover:border-slate-500 transition-all">
            <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${colors[color]} text-white font-black text-lg`}>
                {validity}
            </div>

            <div className="mt-8 mb-4">
                <h3 className="text-3xl font-black text-white mb-1">{title}</h3>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{subtitle}</div>
            </div>

            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {details}
            </p>
            {valSuffix && <div className="text-xs text-slate-500 italic">{valSuffix}</div>}
        </div>
    );
};

export default TrainingTracker;
