
import React, { useState, useEffect } from 'react';
import { User, AuthStatus } from '../types';
import { Shield, Search, CheckCircle, CreditCard, Mail, Edit2, Trash2, Key, AlertTriangle, X, Save, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SUBJECTS } from '../data/learningObjectives';

interface Props {
    currentUser: User;
    onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ currentUser, onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', msg: string} | null>(null);
    
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editSubs, setEditSubs] = useState<string[]>([]);
    const [editTier, setEditTier] = useState<'CUSTOM' | 'PRO_MONTHLY' | 'PRO_YEARLY'>('CUSTOM');
    const [editIsAdmin, setEditIsAdmin] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch Profiles & Subscriptions
            // Note: RLS must allow admin to view all.
            // If RLS blocks this, you need a view or specific admin policy.
            const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
            if (pError) throw pError;

            const { data: subs, error: sError } = await supabase.from('subscriptions').select('*');
            if (sError) throw sError;

            const mappedUsers: User[] = profiles.map((p: any) => {
                const sub = subs.find((s: any) => s.user_id === p.id);
                let tier: any = 'CUSTOM';
                let allowed = ['090']; // default fallback
                let status = AuthStatus.VERIFIED;

                if (sub && sub.status === 'active') {
                    status = AuthStatus.ACTIVE;
                    tier = sub.plan;
                    if (tier?.includes('PRO')) allowed = ['ALL'];
                }

                return {
                    id: p.id,
                    email: p.email || 'No Email',
                    fullName: p.full_name,
                    status: status,
                    studySeconds: 0,
                    subscriptionTier: tier,
                    allowedSubjects: allowed,
                    isAdmin: p.is_admin
                };
            });

            setUsers(mappedUsers);
        } catch (err: any) {
            setFeedback({ type: 'error', msg: err.message });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) || 
                              u.id.toLowerCase().includes(search.toLowerCase()) ||
                              (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === 'ALL' || u.status === filter || (filter === 'PRO' && u.subscriptionTier?.includes('PRO'));
        return matchesSearch && matchesFilter;
    });

    const toggleStatus = async (id: string, currentStatus: AuthStatus) => {
        // Simple manual override simulation for now as "status" is derived
        setFeedback({ type: 'success', msg: `User status toggle is managed via Subscription table updates.` });
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Are you sure? This deletes the database profile record.")) return;
        // In real app, delete auth user via Edge Function. Here we just delete profile row.
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;
            setUsers(users.filter(u => u.id !== id));
            setFeedback({ type: 'success', msg: 'User profile deleted.' });
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const handlePasswordReset = async (email: string) => {
        if (!window.confirm(`Send password reset email to ${email}?`)) return;
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            setFeedback({ type: 'success', msg: `Reset email sent to ${email}` });
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    // --- Edit Modal Handlers ---

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditSubs(user.allowedSubjects || []);
        setEditTier(user.subscriptionTier || 'CUSTOM');
        setEditIsAdmin(user.isAdmin || false);
    };

    const closeEditModal = () => {
        setEditingUser(null);
    };

    const saveEdit = async () => {
        if (!editingUser) return;
        
        try {
            // Update Profile
            await supabase.from('profiles').update({ is_admin: editIsAdmin }).eq('id', editingUser.id);
            
            // Handle Subscription (Check first to avoid ON CONFLICT error if missing DB constraint)
            const { data: existingSub } = await supabase
                .from('subscriptions')
                .select('id')
                .eq('user_id', editingUser.id)
                .maybeSingle();

            const subPayload = {
                user_id: editingUser.id,
                plan: editTier,
                status: 'active',
                updated_at: new Date().toISOString()
            };

            if (existingSub) {
                const { error } = await supabase
                    .from('subscriptions')
                    .update(subPayload)
                    .eq('id', existingSub.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('subscriptions')
                    .insert(subPayload);
                if (error) throw error;
            }

            setFeedback({ type: 'success', msg: 'User updated.' });
            fetchUsers();
            closeEditModal();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const toggleEditSubject = (subId: string) => {
        // Logic for handling custom subject array if we stored it in DB
        // For this demo, PRO plans imply ALL.
        setFeedback({ type: 'success', msg: 'Subject toggling requires PRO plan logic update.' });
    };

    useEffect(() => {
        if (feedback) {
            const t = setTimeout(() => setFeedback(null), 5000); 
            return () => clearTimeout(t);
        }
    }, [feedback]);

    const getStatusColor = (status: AuthStatus) => {
        switch(status) {
            case AuthStatus.ACTIVE: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case AuthStatus.VERIFIED: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 relative">
            {feedback && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl border flex items-center animate-in fade-in slide-in-from-top-4 ${feedback.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 'bg-red-900/90 border-red-500 text-white'}`}>
                    {feedback.type === 'success' ? <CheckCircle className="mr-2" /> : <AlertTriangle className="mr-2" />}
                    {feedback.msg}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Shield className="text-red-500" /> Mission Control (Admin)
                    </h1>
                    <p className="text-slate-400">Manage users, subscriptions, and platform access.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onBack} className="bg-slate-800 text-slate-400 px-4 py-2 rounded font-bold hover:bg-slate-700 border border-slate-600">Exit Admin</button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin mb-4"></div>
                        Loading users from Supabase...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Plan / Access</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-500">
                                                    <span className="font-bold text-xs">{user.fullName?.substring(0,2).toUpperCase() || 'U'}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                        {user.fullName || user.email}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={14} className={user.subscriptionTier?.includes('PRO') ? 'text-purple-400' : 'text-blue-400'} />
                                                <span className="font-bold text-slate-200">{user.subscriptionTier?.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isAdmin ? <span className="text-red-400 font-bold text-xs">ADMIN</span> : <span className="text-slate-500 text-xs">User</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openEditModal(user)} className="p-2 hover:bg-blue-900/30 text-slate-400 hover:text-blue-400 rounded"><Edit2 size={16} /></button>
                                                <button onClick={() => handlePasswordReset(user.email)} className="p-2 hover:bg-yellow-900/30 text-slate-400 hover:text-yellow-400 rounded"><Key size={16} /></button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal (Simplified) */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Plan</label>
                                <select 
                                    value={editTier} 
                                    onChange={e => setEditTier(e.target.value as any)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                                >
                                    <option value="CUSTOM">Custom</option>
                                    <option value="PRO_MONTHLY">Pro Monthly</option>
                                    <option value="PRO_YEARLY">Pro Yearly</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={editIsAdmin} 
                                    onChange={e => setEditIsAdmin(e.target.checked)} 
                                    className="w-4 h-4"
                                />
                                <span className="text-white font-bold">Admin Access</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={closeEditModal} className="px-4 py-2 rounded text-slate-400 hover:text-white">Cancel</button>
                            <button onClick={saveEdit} className="px-6 py-2 bg-blue-600 rounded text-white font-bold hover:bg-blue-500">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
