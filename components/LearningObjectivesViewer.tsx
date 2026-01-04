
import React, { useState } from 'react';
import { LEARNING_OBJECTIVES, SUBJECTS } from '../data/learningObjectives';
import { View } from '../types';
import { Search, Check, ExternalLink } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

const LearningObjectivesViewer: React.FC<Props> = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState<string>('ALL');

    const filtered = LEARNING_OBJECTIVES.filter(lo => {
        const matchesSearch = lo.text.toLowerCase().includes(searchTerm.toLowerCase()) || lo.id.includes(searchTerm);
        const matchesSubject = filterSubject === 'ALL' || lo.subject === filterSubject;
        return matchesSearch && matchesSubject;
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">EASA Learning Objectives Database</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by keyword or LO number (e.g. 010.06...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:border-sky-500 outline-none"
                        />
                    </div>
                    <select 
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none"
                    >
                        <option value="ALL">All Subjects</option>
                        {SUBJECTS.map(s => (
                            <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-2">
                {filtered.map(lo => (
                    <div key={lo.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between group hover:border-sky-500 transition-all">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-bold">{lo.id}</span>
                                <span className="text-slate-400 text-xs font-bold uppercase">{SUBJECTS.find(s => s.id === lo.subject)?.name}</span>
                            </div>
                            <p className="font-medium text-slate-800">{lo.text}</p>
                        </div>
                        {lo.coveredBy ? (
                            <button 
                                onClick={() => onNavigate(lo.coveredBy!)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                            >
                                <Check size={16} />
                                <span className="text-sm font-bold">Launch</span>
                            </button>
                        ) : (
                            <div className="px-4 py-2 text-slate-400 text-sm italic">In Development</div>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        No Learning Objectives found matching criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningObjectivesViewer;
