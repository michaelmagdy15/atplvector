
import React from 'react';
import { Globe, Satellite, Clock } from 'lucide-react';

const GNSSTheory: React.FC = () => {
    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <Satellite className="text-sky-400 w-8 h-8" />
                <h2 className="text-2xl font-bold text-white">GNSS Principles</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-600">
                    <Globe className="text-emerald-500 mb-4" />
                    <h3 className="font-bold text-white mb-2">Trilateration</h3>
                    <p className="text-sm text-slate-400">
                        Requires minimum 4 satellites to solve for Latitude, Longitude, Altitude, and Time error (X, Y, Z, T).
                    </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-600">
                    <Clock className="text-amber-500 mb-4" />
                    <h3 className="font-bold text-white mb-2">Time is Distance</h3>
                    <p className="text-sm text-slate-400">
                        Distance = Speed of Light × Time Delay. Atomic clocks allow nanosecond precision.
                    </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-600">
                    <div className="font-mono text-purple-500 text-xl font-bold mb-4">ABAS / SBAS / GBAS</div>
                    <h3 className="font-bold text-white mb-2">Augmentation</h3>
                    <p className="text-sm text-slate-400">
                        Systems to improve Integrity (RAIM), Accuracy, and Availability.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GNSSTheory;
