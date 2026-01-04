
import React, { useState } from 'react';
import { User } from '../types';
import { Settings, Lock, Mail, Save, AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
    user: User;
    onBack: () => void;
}

const AccountSettings: React.FC<Props> = ({ user, onBack }) => {
    const [email, setEmail] = useState(user.email);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMsg(null);

        try {
            // Update Password if provided
            if (newPassword) {
                if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;
            }

            // Update Email if changed
            if (email !== user.email) {
                const { error } = await supabase.auth.updateUser({ email: email });
                if (error) throw error;
            }

            setMsg({ type: 'success', text: 'Profile updated successfully.' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMsg({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8">
            <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-6 font-bold text-sm transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            <div className="bg-slate-900 rounded-xl border border-slate-700 p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Settings className="text-slate-400" /> Account Settings
                </h1>

                {msg && (
                    <div className={`p-4 rounded-lg mb-6 border ${msg.type === 'success' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
                        <div className="flex items-center gap-2 font-bold text-sm">
                            {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                            {msg.text}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-sm font-bold text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                                    <input 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={e => setNewPassword(e.target.value)} 
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
