
import React, { useState } from 'react';
import { User, View } from '../types';
import { User as UserIcon, Mail, Clock, Shield, LogOut, Lock, CheckCircle, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
    user: User;
    studyTime: number;
    onLogout: () => void;
    onUpdateUser?: (user: User) => void;
    onNavigate?: (view: View) => void;
}

const UserProfile: React.FC<Props> = ({ user, studyTime, onLogout, onUpdateUser, onNavigate }) => {
    const [loading, setLoading] = useState(false);
    
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const toggleAdmin = async () => {
        // Only allow if user is actually admin in DB or dev mode
        alert("Admin status is managed via database directly for security.");
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-12">
            <h1 className="text-3xl font-black text-white mb-8">Pilot Profile</h1>
            
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl mb-8">
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-8 flex items-center space-x-6 relative">
                    <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-lg">
                        <UserIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {user.fullName || `Captain ${user.id.substring(0, 6)}...`}
                        </h2>
                        <div className="flex items-center text-slate-300 mt-1">
                            <Mail className="w-4 h-4 mr-2" /> {user.email}
                        </div>
                        <div className="mt-2 inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">
                            LICENSE ACTIVE
                        </div>
                    </div>
                    
                    {/* Account Settings Button */}
                    <button 
                        onClick={() => onNavigate && onNavigate(View.ACCOUNT_SETTINGS)}
                        className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-600 transition-colors"
                        title="Account Settings"
                    >
                        <Settings size={20} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <div className="flex items-center mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Clock className="w-4 h-4 mr-2" /> Total Logged Time
                        </div>
                        <div className="text-3xl font-mono font-bold text-white">{formatTime(studyTime)}</div>
                    </div>
                    
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <div className="flex items-center mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Shield className="w-4 h-4 mr-2" /> Access Level
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {user.isAdmin ? <span className="text-red-400">Admin</span> : (user.subscriptionTier ? user.subscriptionTier : 'Basic')}
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={onLogout}
                className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold rounded-xl border border-red-900/50 transition flex items-center justify-center"
            >
                <LogOut className="w-5 h-5 mr-2" /> Sign Out
            </button>
        </div>
    );
};

export default UserProfile;
