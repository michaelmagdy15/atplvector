
import React from 'react';
import { calculateProgress } from '../data/learningObjectives';
import { CheckCircle, Circle, BarChart3 } from 'lucide-react';

const PlatformProgress: React.FC = () => {
    const stats = calculateProgress();
    // Weighted Calculation for Overall:
    // Total LOs across all subjects
    const totalLOs = stats.reduce((acc, curr) => acc + curr.totalLOs, 0);
    // Rough estimate of covered based on our manual mapping
    // Since we don't have every single LO mapped in the DB yet, we project based on module count
    // Real implementation would count actual DB entries.
    // For this demo, we use the percentage calculated in data/learningObjectives
    
    // Calculate overall weighted percentage
    const weightedSum = stats.reduce((acc, curr) => acc + (curr.percentage * curr.totalLOs), 0);
    const overallPercent = Math.round(weightedSum / totalLOs);

    return (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="text-sky-500" /> Syllabus Coverage
                    </h3>
                    <p className="text-slate-400 text-xs">Based on EASA ECQB Learning Objectives</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-white">{overallPercent}%</span>
                    <span className="text-slate-500 text-xs block">System Ready</span>
                </div>
            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-sky-600 to-indigo-600 transition-all duration-1000" style={{ width: `${overallPercent}%` }}></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(sub => {
                    const subPercent = sub.percentage;
                    return (
                        <div key={sub.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-300">{sub.id} {sub.name.split(':')[0]}</span>
                                <span className={`text-xs font-bold ${subPercent > 80 ? 'text-green-400' : subPercent > 40 ? 'text-yellow-400' : 'text-slate-500'}`}>{subPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full ${subPercent > 80 ? 'bg-green-500' : subPercent > 40 ? 'bg-yellow-500' : 'bg-slate-500'}`} style={{ width: `${subPercent}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlatformProgress;
