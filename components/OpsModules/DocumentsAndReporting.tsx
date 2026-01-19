import React, { useState } from 'react';
import { FileCheck, Clock, AlertTriangle, CheckCircle, XCircle, Clipboard } from 'lucide-react';

const DocumentsAndReporting: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'docs' | 'report' | 'lease'>('docs');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <FileCheck className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Documents & Reporting</h2>
                    <p className="text-slate-400 text-sm">Required documents, reporting timelines, and leasing.</p>
                </div>
            </div>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
                {[
                    { id: 'docs', label: 'On-Board Docs' },
                    { id: 'report', label: 'Occurrence Reporting' },
                    { id: 'lease', label: 'Leasing' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === t.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'docs' && <DocumentsSection />}
            {activeTab === 'report' && <ReportingSection />}
            {activeTab === 'lease' && <LeasingSection />}
        </div>
    );
};

const DocumentsSection = () => {
    const aircraftDocs = [
        { name: 'Certificate of Registration', abbr: 'C of R', critical: true },
        { name: 'Certificate of Airworthiness', abbr: 'C of A', critical: true },
        { name: 'Noise Certification', abbr: 'Noise Cert', critical: false },
        { name: 'Air Operator Certificate', abbr: 'AOC', critical: true },
        { name: 'Aircraft Radio License', abbr: 'Radio Lic', critical: true },
        { name: 'Third Party Liability Insurance', abbr: 'Insurance', critical: true },
        { name: 'Valid Flight Crew Licenses', abbr: 'FCL', critical: true },
    ];

    const flightDocs = [
        { name: 'Mass & Balance Sheet', abbr: 'M&B' },
        { name: 'Operational Flight Plan', abbr: 'OFP' },
        { name: 'NOTAMs', abbr: 'NOTAMs' },
        { name: 'Special Loads Notification', abbr: 'NOTOC' },
        { name: 'Technical Log', abbr: 'Tech Log' },
    ];

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Clipboard className="w-5 h-5 text-blue-400" />
                    Aircraft Documents (On Board)
                </h3>
                <div className="space-y-2">
                    {aircraftDocs.map((doc, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${doc.critical ? 'bg-red-900/20 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                            <div>
                                <div className="font-bold text-white text-sm">{doc.name}</div>
                                <div className="text-xs text-slate-500">{doc.abbr}</div>
                            </div>
                            {doc.critical && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">MANDATORY</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    Flight Documents
                </h3>
                <div className="space-y-2">
                    {flightDocs.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                            <div>
                                <div className="font-bold text-white text-sm">{doc.name}</div>
                                <div className="text-xs text-slate-500">{doc.abbr}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-bold text-blue-300 text-sm mb-2">CRS - Certificate of Release to Service</h4>
                    <p className="text-xs text-slate-400">
                        Contains identity of the AMO (Part 145) and identity of the engineer (Part 66).
                        Required before dispatch.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ReportingSection = () => {
    const reports = [
        {
            type: 'Safety Hazard / Bird Strike / Unlawful Interference / ACAS RA',
            timeline: 'IMMEDIATELY',
            to: 'Authority + ATS',
            color: 'red'
        },
        {
            type: 'Other Occurrences',
            timeline: '72 Hours',
            to: 'State of Operator',
            color: 'orange'
        },
        {
            type: 'FDR Preservation (After Accident)',
            timeline: '60 Days',
            to: 'Retained by Operator',
            color: 'yellow'
        },
        {
            type: 'Ramp Inspection Response',
            timeline: '10 Days',
            to: 'Inspecting State',
            color: 'blue'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                {reports.map((r, i) => (
                    <div key={i} className={`p-5 rounded-xl border-2 border-${r.color}-500/50 bg-${r.color}-900/10`}>
                        <div className={`text-3xl font-black text-${r.color}-400 mb-2`}>{r.timeline}</div>
                        <div className="font-bold text-white text-sm mb-1">{r.type}</div>
                        <div className="text-xs text-slate-400">Report to: {r.to}</div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4">Crew Reporting Responsibilities</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <span>Cabin crew must report anything affecting safety to the Commander.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Anything affecting safety of OTHER flights must be reported to ATS <strong>immediately</strong>.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const LeasingSection = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <h3 className="text-2xl font-black text-white mb-2">DRY LEASE</h3>
                <p className="text-slate-400 text-sm mb-4">Aircraft only — No crew provided.</p>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Operated under <strong>Lessee's AOC</strong>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Lessee provides crew, maintenance, insurance
                    </li>
                    <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Dry Lease-In (Non-EU): Max <strong>7 months</strong> in 12 consecutive months
                    </li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <h3 className="text-2xl font-black text-white mb-2">WET LEASE</h3>
                <p className="text-slate-400 text-sm mb-4">Aircraft + Crew provided.</p>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Operated under <strong>Lessor's AOC</strong>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Lessor provides crew, maintenance, insurance
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Also known as ACMI (Aircraft, Crew, Maintenance, Insurance)
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DocumentsAndReporting;
