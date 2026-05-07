
import React, { useState, useEffect } from 'react';
import { User, AuthStatus, AdminStats } from '../types';
import {
    Shield, Search, CheckCircle, CreditCard, Mail, Edit2, Trash2, Key,
    AlertTriangle, X, Save, User as UserIcon, Users, TrendingUp, Crown,
    Clock, Filter, ChevronDown, ChevronRight, BarChart3, Settings,
    UserCheck, UserX, Ban, RefreshCw, Download, MoreVertical,
    Activity, Calendar, Zap, Eye, Layers, Award, KeyRound, Copy, Star
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { SUBJECTS } from '../data/learningObjectives';
import { Testimonial } from '../types';
import { TestimonialService } from '../services/TestimonialService';

interface Props {
    currentUser: User;
    onBack: () => void;
}


type AdminTab = 'OVERVIEW' | 'USERS' | 'MEMBERSHIPS' | 'ANALYTICS' | 'INVITES' | 'TESTIMONIALS';


const AdminDashboard: React.FC<Props> = ({ currentUser, onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [planFilter, setPlanFilter] = useState<string>('ALL');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [inviteCodes, setInviteCodes] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editSubs, setEditSubs] = useState<string[]>([]);
    const [editTier, setEditTier] = useState<'1_MONTH' | '3_MONTHS' | '6_MONTHS' | '9_MONTHS' | '12_MONTHS' | 'SINGLE_SUBJECT' | 'CUSTOM' | 'PRO_MONTHLY' | 'PRO_YEARLY'>('12_MONTHS');
    const [editIsAdmin, setEditIsAdmin] = useState(false);
    const [editStatus, setEditStatus] = useState<AuthStatus>(AuthStatus.VERIFIED);

    // Bulk Selection
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            calculateStats();
        }
    }, [users]);

    // Fetch invite codes when switching to Invites tab
    useEffect(() => {
        if (activeTab === 'INVITES') {
            const fetchCodes = async () => {
                try {
                    const codesRef = collection(db, 'access_codes');
                    const q = query(codesRef, orderBy('created_at', 'desc'));
                    const querySnapshot = await getDocs(q);
                    const codes = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    setInviteCodes(codes as any);
                } catch (error) {
                    console.error("Error fetching codes:", error);
                }
            };
            fetchCodes();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const profilesRef = collection(db, 'profiles');
            const profilesSnapshot = await getDocs(profilesRef);
            const profiles = profilesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            const subsRef = collection(db, 'subscriptions');
            const subsSnapshot = await getDocs(subsRef);
            const subs = subsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            // Fetch testimonials
            if (activeTab === 'TESTIMONIALS') {
                try {
                    const t = await TestimonialService.getAllTestimonials();
                    setTestimonials(t);
                } catch (e: any) {
                    console.error("Failed to fetch testimonials", e);
                }
            }

            const mappedUsers: User[] = (profiles as any[]).map((p: any) => {
                const sub: any = subs?.find((s: any) => s.user_id === p.id);
                let tier: any = 'CUSTOM';
                let allowed = ['090'];
                let status = p.status || (p.is_approved === false ? AuthStatus.PENDING_APPROVAL : AuthStatus.VERIFIED);

                if (sub && sub.status === 'active') {
                    status = AuthStatus.ACTIVE;
                    tier = sub.plan;
                    if (tier?.includes('PRO')) allowed = ['ALL'];
                } else if (p.demo_start_date) {
                    // Calculate demo status dynamically for admin view
                    const demoStart = new Date((p.demo_start_date as any).toDate?.() || p.demo_start_date);
                    const now = new Date();
                    const hoursSince = (now.getTime() - demoStart.getTime()) / (1000 * 60 * 60);
                    if (hoursSince < 3) {
                        status = AuthStatus.DEMO_PREVIEW;
                    } else {
                        status = AuthStatus.DEMO_EXPIRED;
                    }
                }

                return {
                    id: p.id,
                    email: p.email || 'No Email',
                    fullName: p.full_name,
                    status: status,
                    studySeconds: p.study_seconds || 0,
                    subscriptionTier: tier,
                    allowedSubjects: allowed,
                    isAdmin: p.is_admin,
                    isApproved: p.is_approved,
                    demoStartDate: p.demo_start_date,
                    createdAt: p.created_at
                } as User & { createdAt?: string };
            });

            // Sort by creation date (newest first) if available
            mappedUsers.sort((a: any, b: any) => {
                if (a.createdAt && b.createdAt) {
                    const dateA = (a.createdAt as any).toDate?.() || new Date(a.createdAt);
                    const dateB = (b.createdAt as any).toDate?.() || new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                }
                return 0;
            });

            setUsers(mappedUsers);
        } catch (err: any) {
            setFeedback({ type: 'error', msg: err.message });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const totalUsers = users.length;
        const pendingApproval = users.filter(u => u.status === AuthStatus.PENDING_APPROVAL || u.isApproved === false).length;
        const activeSubscriptions = users.filter(u => u.status === AuthStatus.ACTIVE).length;
        const proUsers = users.filter(u => u.subscriptionTier?.includes('PRO')).length;
        const adminCount = users.filter(u => u.isAdmin).length;
        const recentSignups = users.slice(0, 5);

        setStats({
            totalUsers,
            pendingApproval,
            activeSubscriptions,
            proUsers,
            adminCount,
            recentSignups
        });
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.id.toLowerCase().includes(search.toLowerCase()) ||
            (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
        const matchesPlan = planFilter === 'ALL' || u.subscriptionTier === planFilter;
        const matchesRole = roleFilter === 'ALL' ||
            (roleFilter === 'ADMIN' && u.isAdmin) ||
            (roleFilter === 'USER' && !u.isAdmin);
        return matchesSearch && matchesStatus && matchesPlan && matchesRole;
    });

    // User Actions
    const approveUser = async (userId: string) => {
        try {
            const userDocRef = doc(db, 'profiles', userId);
            await updateDoc(userDocRef, {
                is_approved: true,
                status: AuthStatus.VERIFIED
            });
            setFeedback({ type: 'success', msg: 'User approved successfully!' });
            fetchUsers();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const suspendUser = async (userId: string) => {
        if (!window.confirm("Suspend this user? They will not be able to access the platform.")) return;
        try {
            const userDocRef = doc(db, 'profiles', userId);
            await updateDoc(userDocRef, {
                status: AuthStatus.SUSPENDED
            });
            setFeedback({ type: 'success', msg: 'User suspended.' });
            fetchUsers();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const banUser = async (userId: string) => {
        if (!window.confirm("BAN this user? This action is serious and should be reserved for violations.")) return;
        try {
            const userDocRef = doc(db, 'profiles', userId);
            await updateDoc(userDocRef, {
                status: AuthStatus.BANNED
            });
            setFeedback({ type: 'success', msg: 'User has been banned.' });
            fetchUsers();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const reactivateUser = async (userId: string) => {
        try {
            const userDocRef = doc(db, 'profiles', userId);
            await updateDoc(userDocRef, {
                status: AuthStatus.VERIFIED,
                is_approved: true
            });
            setFeedback({ type: 'success', msg: 'User reactivated.' });
            fetchUsers();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Are you sure? This deletes the database profile record permanently.")) return;
        try {
            const userDocRef = doc(db, 'profiles', id);
            await deleteDoc(userDocRef);
            setUsers(users.filter(u => u.id !== id));
            setFeedback({ type: 'success', msg: 'User profile deleted.' });
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    const handlePasswordReset = async (email: string) => {
        if (!window.confirm(`Send password reset email to ${email}?`)) return;
        try {
            await sendPasswordResetEmail(auth, email);
            setFeedback({ type: 'success', msg: `Reset email sent to ${email}` });
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    // Edit Modal Handlers
    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditSubs(user.allowedSubjects || []);
        setEditTier(user.subscriptionTier || 'CUSTOM');
        setEditIsAdmin(user.isAdmin || false);
        setEditStatus(user.status);
    };

    const closeEditModal = () => {
        setEditingUser(null);
    };

    const saveEdit = async () => {
        if (!editingUser) return;

        try {
            // Update Profile
            const userDocRef = doc(db, 'profiles', editingUser.id);
            await updateDoc(userDocRef, {
                is_admin: editIsAdmin,
                status: editStatus
            });

            // Handle Subscription
            const subsRef = collection(db, 'subscriptions');
            const q = query(subsRef, where('user_id', '==', editingUser.id));
            const querySnapshot = await getDocs(q);

            const subPayload = {
                user_id: editingUser.id,
                plan: editTier,
                status: 'active',
                updated_at: new Date().toISOString()
            };

            if (!querySnapshot.empty) {
                // Update existing subscription
                const subDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'subscriptions', subDoc.id), subPayload);
            } else {
                // This would be handled by client creating a new subscription doc
                // In Firestore, you'd typically use addDoc or setDoc
                const subCollRef = collection(db, 'subscriptions');
                // Note: You may need to use addDoc or setDoc depending on your schema
                await updateDoc(doc(subCollRef), subPayload);
            }

            setFeedback({ type: 'success', msg: 'User updated successfully.' });
            fetchUsers();
            closeEditModal();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    // Bulk Actions
    const toggleSelectUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAllFiltered = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    const bulkApprove = async () => {
        if (!window.confirm(`Approve ${selectedUsers.length} users?`)) return;
        try {
            const batch = writeBatch(db);
            selectedUsers.forEach(userId => {
                const userDocRef = doc(db, 'profiles', userId);
                batch.update(userDocRef, {
                    is_approved: true,
                    status: AuthStatus.VERIFIED
                });
            });
            await batch.commit();
            setFeedback({ type: 'success', msg: `${selectedUsers.length} users approved.` });
            setSelectedUsers([]);
            fetchUsers();
        } catch (e: any) {
            setFeedback({ type: 'error', msg: e.message });
        }
    };

    useEffect(() => {
        if (feedback) {
            const t = setTimeout(() => setFeedback(null), 5000);
            return () => clearTimeout(t);
        }
    }, [feedback]);

    const getStatusColor = (status: AuthStatus) => {
        switch (status) {
            case AuthStatus.ACTIVE: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case AuthStatus.FREE_TRIAL: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50';
            case AuthStatus.TRIAL_EXPIRED: return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
            case AuthStatus.VERIFIED: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case AuthStatus.PENDING_APPROVAL: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case AuthStatus.SUSPENDED: return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case AuthStatus.BANNED: return 'bg-red-500/20 text-red-400 border-red-500/50';
            case AuthStatus.DEMO_PREVIEW: return 'bg-sky-500/20 text-sky-400 border-sky-500/50';
            case AuthStatus.DEMO_EXPIRED: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const getStatusLabel = (status: AuthStatus) => {
        switch (status) {
            case AuthStatus.ACTIVE: return 'Active';
            case AuthStatus.FREE_TRIAL: return 'Free Trial';
            case AuthStatus.TRIAL_EXPIRED: return 'Trial Expired';
            case AuthStatus.VERIFIED: return 'Verified';
            case AuthStatus.PENDING_APPROVAL: return 'Pending';
            case AuthStatus.SUSPENDED: return 'Suspended';
            case AuthStatus.BANNED: return 'Banned';
            case AuthStatus.SIGNED_UP: return 'Signed Up';
            case AuthStatus.DEMO_PREVIEW: return 'Demo Active';
            case AuthStatus.DEMO_EXPIRED: return 'Demo Ended';
            default: return status;
        }
    };

    // Tab Components
    const OverviewTab = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-blue-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Users className="text-blue-400 w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-slate-500 uppercase font-bold">Total</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats?.totalUsers || 0}</p>
                    <p className="text-sm text-slate-400">Users</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-yellow-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Clock className="text-yellow-400 w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-slate-500 uppercase font-bold">Pending</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats?.pendingApproval || 0}</p>
                    <p className="text-sm text-slate-400">Awaiting Approval</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Crown className="text-purple-400 w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-slate-500 uppercase font-bold">Pro</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats?.proUsers || 0}</p>
                    <p className="text-sm text-slate-400">Pro Subscribers</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-red-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Shield className="text-red-400 w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-slate-500 uppercase font-bold">Admins</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats?.adminCount || 0}</p>
                    <p className="text-sm text-slate-400">Administrators</p>
                </div>
            </div>

            {/* Pending Approvals Quick Actions */}
            {stats && stats.pendingApproval > 0 && (
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-yellow-400" />
                            <h3 className="text-lg font-bold text-white">Pending Approvals</h3>
                        </div>
                        <button
                            onClick={() => setActiveTab('USERS')}
                            className="text-sm text-yellow-400 hover:text-yellow-300 font-bold"
                        >
                            View All →
                        </button>
                    </div>
                    <p className="text-slate-300 mb-4">
                        {stats.pendingApproval} user(s) are waiting for your approval to access the platform.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {users.filter(u => u.status === AuthStatus.PENDING_APPROVAL || u.isApproved === false).slice(0, 3).map(u => (
                            <div key={u.id} className="bg-slate-900/50 rounded-lg px-3 py-2 flex items-center gap-3">
                                <span className="text-white font-medium text-sm">{u.fullName || u.email}</span>
                                <button
                                    onClick={() => approveUser(u.id)}
                                    className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded font-bold"
                                >
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Signups */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" /> Recent Signups
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {stats?.recentSignups.slice(0, 5).map(user => (
                            <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                                        <span className="font-bold text-sm text-slate-300">
                                            {user.fullName?.substring(0, 2).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{user.fullName || 'No Name'}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(user.status)}`}>
                                        {getStatusLabel(user.status)}
                                    </span>
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plan Distribution */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="text-purple-400" /> Subscription Plans
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: 'PRO_YEARLY', label: 'Pro Yearly', color: 'bg-indigo-500' },
                            { id: 'PRO_MONTHLY', label: 'Pro Monthly', color: 'bg-purple-500' },
                            { id: 'CUSTOM', label: 'Custom', color: 'bg-blue-500' },
                        ].map(plan => {
                            const count = users.filter(u => u.subscriptionTier === plan.id).length;
                            const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                            return (
                                <div key={plan.id} className="flex items-center gap-3">
                                    <span className="text-sm text-slate-400 w-24">{plan.label}</span>
                                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${plan.color} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white w-10 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    const InvitesTab = () => {
        const generateCode = async () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            try {
                const codesRef = collection(db, 'access_codes');
                const newCodeDoc = await addDoc(codesRef, {
                    code,
                    created_by: currentUser.id,
                    created_at: serverTimestamp(),
                    is_used: false,
                    used_by_user: null
                });

                // Immediately add to local state for instant display
                setInviteCodes(prev => [{
                    id: newCodeDoc.id,
                    code,
                    created_by: currentUser.id,
                    created_at: new Date().toISOString(),
                    is_used: false,
                    used_by_user: null
                }, ...prev]);
                setFeedback({ type: 'success', msg: `Code generated: ${code}` });
            } catch (error: any) {
                setFeedback({ type: 'error', msg: error.message });
            }
        };

        const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
            setFeedback({ type: 'success', msg: 'Copied to clipboard!' });
        };

        return (
            <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Generate Access Code</h3>
                        <p className="text-slate-400 text-sm">Create a unique 8-character code for new users.</p>
                    </div>
                    <button
                        onClick={generateCode}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                        <Zap size={18} /> Generate New Code
                    </button>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-white">Active & Used Codes</h3>
                        <button onClick={fetchUsers} className="text-slate-400 hover:text-white"><RefreshCw size={16} /></button>
                    </div>

                    {inviteCodes.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No invite codes found. Generate one to get started.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Used By</th>
                                        <th className="px-6 py-4">Created At</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {inviteCodes.map((code) => (
                                        <tr key={code.code} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-white text-lg tracking-wider font-bold">{code.code}</td>
                                            <td className="px-6 py-4">
                                                {code.is_used ? (
                                                    <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs font-bold uppercase">Used</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {code.used_by_user ? (
                                                    <span className="text-white text-xs font-mono">{code.used_by_user.slice(0, 8)}...</span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                {new Date(code.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => copyToClipboard(code.code)}
                                                    className="p-2 hover:bg-slate-700 text-blue-400 rounded transition-colors"
                                                    title="Copy Code"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const UsersTab = () => (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, email, or ID..."
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                        >
                            <option value="ALL">All Status</option>
                            <option value={AuthStatus.PENDING_APPROVAL}>Pending</option>
                            <option value={AuthStatus.FREE_TRIAL}>Free Trial</option>
                            <option value={AuthStatus.TRIAL_EXPIRED}>Trial Expired</option>
                            <option value={AuthStatus.VERIFIED}>Verified</option>
                            <option value={AuthStatus.ACTIVE}>Active</option>
                            <option value={AuthStatus.SUSPENDED}>Suspended</option>
                            <option value={AuthStatus.BANNED}>Banned</option>
                            <option value={AuthStatus.DEMO_PREVIEW}>Demo Active</option>
                            <option value={AuthStatus.DEMO_EXPIRED}>Demo Expired</option>
                        </select>


                        <select
                            value={planFilter}
                            onChange={e => setPlanFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                        >
                            <option value="ALL">All Plans</option>
                            <option value="CUSTOM">Custom</option>
                            <option value="PRO_MONTHLY">Pro Monthly</option>
                            <option value="PRO_YEARLY">Pro Yearly</option>
                        </select>

                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="ADMIN">Admins</option>
                            <option value="USER">Users</option>
                        </select>

                        <button
                            onClick={fetchUsers}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-4">
                        <span className="text-sm text-slate-400">{selectedUsers.length} selected</span>
                        <button
                            onClick={bulkApprove}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-sm font-bold"
                        >
                            Approve All
                        </button>
                        <button
                            onClick={() => setSelectedUsers([])}
                            className="text-slate-400 hover:text-white text-sm"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin mb-4"></div>
                        Loading users...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400 min-w-[800px]">
                            <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-4 py-4 w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onChange={selectAllFiltered}
                                            className="w-4 h-4 rounded cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-4 whitespace-nowrap">User</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Status</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Plan</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Role</th>
                                    <th className="px-4 py-4 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleSelectUser(user.id)}
                                                className="w-4 h-4 rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-slate-400 group-hover:border-blue-500 transition-colors">
                                                    <span className="font-bold text-xs">{user.fullName?.substring(0, 2).toUpperCase() || 'U'}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                        {user.fullName || 'No Name'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(user.status)}`}>
                                                {getStatusLabel(user.status)}
                                            </span>
                                            {user.status === AuthStatus.FREE_TRIAL && user.trialStartDate && (
                                                <div className="text-[10px] text-slate-500 mt-1">
                                                    Started: {new Date(user.trialStartDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={14} className={user.subscriptionTier?.includes('PRO') ? 'text-purple-400' : 'text-blue-400'} />
                                                <span className="font-medium text-slate-200">{user.subscriptionTier?.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {user.isAdmin ? (
                                                <span className="text-red-400 font-bold text-xs flex items-center gap-1">
                                                    <Shield size={12} /> ADMIN
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-xs">User</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                {(user.status === AuthStatus.PENDING_APPROVAL || user.isApproved === false) && (
                                                    <button
                                                        onClick={() => approveUser(user.id)}
                                                        className="p-2.5 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <UserCheck size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => openEditModal(user)} className="p-2.5 hover:bg-blue-900/30 text-slate-400 hover:text-blue-400 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handlePasswordReset(user.email)} className="p-2.5 hover:bg-yellow-900/30 text-slate-400 hover:text-yellow-400 rounded-lg transition-colors" title="Reset Password">
                                                    <Key size={18} />
                                                </button>
                                                {user.status === AuthStatus.SUSPENDED || user.status === AuthStatus.BANNED ? (
                                                    <button onClick={() => reactivateUser(user.id)} className="p-2.5 hover:bg-green-900/30 text-slate-400 hover:text-green-400 rounded-lg transition-colors" title="Reactivate">
                                                        <RefreshCw size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => suspendUser(user.id)} className="p-2.5 hover:bg-orange-900/30 text-slate-400 hover:text-orange-400 rounded-lg transition-colors" title="Suspend">
                                                        <UserX size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center text-slate-500">
                                No users match your filters.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );

    const MembershipsTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-900/30 rounded-lg">
                            <Layers className="text-blue-400 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Custom Plan</h3>
                            <p className="text-sm text-slate-400">Single subject access</p>
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white mb-2">
                        {users.filter(u => u.subscriptionTier === 'CUSTOM').length}
                    </p>
                    <p className="text-sm text-slate-500">users</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-900/30 rounded-lg">
                            <Crown className="text-purple-400 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Pro Monthly</h3>
                            <p className="text-sm text-slate-400">Full access - Monthly</p>
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white mb-2">
                        {users.filter(u => u.subscriptionTier === 'PRO_MONTHLY').length}
                    </p>
                    <p className="text-sm text-slate-500">users</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-indigo-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-900/30 rounded-lg">
                            <Award className="text-indigo-400 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Pro Yearly</h3>
                            <p className="text-sm text-slate-400">Full access - Annual</p>
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white mb-2">
                        {users.filter(u => u.subscriptionTier === 'PRO_YEARLY').length}
                    </p>
                    <p className="text-sm text-slate-500">users</p>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h3 className="font-bold text-white">All Subscriptions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-300 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Current Plan</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.filter(u => u.subscriptionTier).map(user => (
                                <tr key={user.id} className="hover:bg-slate-700/30">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-white">{user.fullName || user.email}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.subscriptionTier?.includes('PRO')
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {user.subscriptionTier?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(user.status)}`}>
                                            {getStatusLabel(user.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const TestimonialsTab = () => {
        const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
            try {
                await TestimonialService.updateStatus(id, newStatus);
                setFeedback({ type: 'success', msg: `Testimonial marked as ${newStatus}` });
                // Refresh local state
                setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            } catch (e: any) {
                setFeedback({ type: 'error', msg: e.message });
            }
        };

        return (
            <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Manage Testimonials</h3>
                    {testimonials.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No testimonials submitted yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {testimonials.map((t) => (
                                <div key={t.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${t.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                t.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {t.status}
                                            </span>
                                            <span className="text-slate-400 text-xs">
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-white italic mb-2">"{t.text}"</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className="font-bold text-slate-300">{t.userName}</span>
                                            <span>•</span>
                                            <span>{t.userRole}</span>
                                            <span>•</span>
                                            <span className="flex items-center text-yellow-400">
                                                {t.rating} <Star size={12} fill="currentColor" className="ml-0.5" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 justify-center">
                                        {t.status !== 'approved' && (
                                            <button
                                                onClick={() => handleStatusUpdate(t.id, 'approved')}
                                                className="p-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {t.status !== 'rejected' && (
                                            <button
                                                onClick={() => handleStatusUpdate(t.id, 'rejected')}
                                                className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AnalyticsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Distribution */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="text-blue-400" /> User Status Distribution
                    </h3>
                    <div className="space-y-3">
                        {[
                            { status: AuthStatus.ACTIVE, label: 'Active', color: 'bg-emerald-500' },
                            { status: AuthStatus.VERIFIED, label: 'Verified', color: 'bg-blue-500' },
                            { status: AuthStatus.PENDING_APPROVAL, label: 'Pending', color: 'bg-yellow-500' },
                            { status: AuthStatus.SUSPENDED, label: 'Suspended', color: 'bg-orange-500' },
                            { status: AuthStatus.BANNED, label: 'Banned', color: 'bg-red-500' },
                        ].map(item => {
                            const count = users.filter(u => u.status === item.status).length;
                            const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                            return (
                                <div key={item.status} className="flex items-center gap-3">
                                    <span className="text-sm text-slate-400 w-24">{item.label}</span>
                                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white w-10 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Plan Distribution */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="text-purple-400" /> Subscription Plans
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: 'PRO_YEARLY', label: 'Pro Yearly', color: 'bg-indigo-500' },
                            { id: 'PRO_MONTHLY', label: 'Pro Monthly', color: 'bg-purple-500' },
                            { id: 'CUSTOM', label: 'Custom', color: 'bg-blue-500' },
                        ].map(plan => {
                            const count = users.filter(u => u.subscriptionTier === plan.id).length;
                            const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                            return (
                                <div key={plan.id} className="flex items-center gap-3">
                                    <span className="text-sm text-slate-400 w-24">{plan.label}</span>
                                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${plan.color} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white w-10 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Shield className="text-red-500" size={32} /> Admin Command
                        </h1>
                        <p className="text-slate-400">Manage users, system status, and content access.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold border border-slate-700 transition"
                        >
                            Exit Dashboard
                        </button>
                    </div>
                </div>

                {/* Feedback Toast */}
                {feedback && (
                    <div className={`p-4 rounded-xl border ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' : 'bg-red-500/10 border-red-500/20 text-red-200'} flex items-center gap-3 animate-in slide-in-from-top-4 fixed top-4 right-4 z-50 shadow-2xl`}>
                        {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        <span className="font-bold">{feedback.msg}</span>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Nav */}
                    <div className="lg:w-64 space-y-2">
                        {[
                            { id: 'OVERVIEW', label: 'Overview', icon: BarChart3 },
                            { id: 'USERS', label: 'User Management', icon: Users },
                            { id: 'MEMBERSHIPS', label: 'Subscriptions', icon: CreditCard },
                            { id: 'INVITES', label: 'Invites & Access', icon: KeyRound },
                            { id: 'TESTIMONIALS', label: 'Testimonials', icon: Star },
                            { id: 'ANALYTICS', label: 'System Analytics', icon: Activity },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as AdminTab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} /> {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === 'OVERVIEW' && <OverviewTab />}
                        {activeTab === 'USERS' && <UsersTab />}
                        {activeTab === 'MEMBERSHIPS' && <MembershipsTab />}
                        {activeTab === 'ANALYTICS' && <AnalyticsTab />}
                        {activeTab === 'INVITES' && <InvitesTab />}
                        {activeTab === 'TESTIMONIALS' && <TestimonialsTab />}
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Edit User Profile</h3>
                            <button onClick={closeEditModal} className="text-slate-500 hover:text-white"><X /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">User</label>
                                <p className="text-white font-medium">{editingUser.fullName} ({editingUser.email})</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as AuthStatus)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                >
                                    {Object.values(AuthStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subscription Plan</label>
                                <select
                                    value={editTier}
                                    onChange={(e) => setEditTier(e.target.value as any)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="CUSTOM">Custom (Subject based)</option>
                                    <option value="PRO_MONTHLY">Pro Monthly</option>
                                    <option value="PRO_YEARLY">Pro Yearly</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <Shield className={editIsAdmin ? "text-red-400" : "text-slate-500"} />
                                <div className="flex-1">
                                    <label className="font-bold text-white block">Administrator Access</label>
                                    <p className="text-xs text-slate-400">Can access this dashboard and manage users.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={editIsAdmin}
                                    onChange={e => setEditIsAdmin(e.target.checked)}
                                    className="w-5 h-5 rounded accent-red-500"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button onClick={closeEditModal} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold">Cancel</button>
                                <button onClick={saveEdit} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
