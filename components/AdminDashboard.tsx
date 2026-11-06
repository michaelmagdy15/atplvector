import React, { useState, useEffect, useMemo } from 'react';
import { User, AuthStatus, AdminStats, LicenceTrack, Testimonial } from '../types';
import {
  Shield,
  Search,
  CheckCircle,
  CreditCard,
  Mail,
  Edit2,
  Trash2,
  Key,
  AlertTriangle,
  X,
  Save,
  Users,
  Crown,
  Clock,
  BarChart3,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  Activity,
  Calendar,
  Zap,
  Layers,
  Award,
  KeyRound,
  Copy,
  Star,
  Plus,
  Unlock,
  Smartphone,
  BookOpen,
  Compass,
  Plane,
  CheckSquare,
  Square,
  Globe,
  MapPin,
  Wifi,
  Gift,
} from 'lucide-react';
import { db, collection, doc, auth } from '../lib/firebase';
import {
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  writeBatch,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { SUBJECTS } from '../data/learningObjectives';
import { TestimonialService } from '../services/TestimonialService';

interface Props {
  currentUser: User;
  onBack: () => void;
}

type AdminTab =
  | 'OVERVIEW'
  | 'USERS'
  | 'QUICK_GRANT'
  | 'MEMBERSHIPS'
  | 'SYSTEM_MODULES'
  | 'INVITES'
  | 'TESTIMONIALS'
  | 'ANALYTICS';

interface ExtendedAdminUser extends User {
  createdAt?: string;
  currentDeviceId?: string | null;
  country?: string;
  city?: string;
  countryCode?: string;
  timezone?: string;
  lastActiveAt?: string;
  isOnlineNow?: boolean;
}

const PLAN_OPTIONS: {
  id: string;
  label: string;
  defaultDays: number | null;
  fullAccess: boolean;
  badgeColor: string;
}[] = [
  { id: 'OWNER', label: 'Owner (Lifetime Full)', defaultDays: null, fullAccess: true, badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40' },
  { id: 'ALL_TRACKS', label: 'All Tracks (ATPL + PPL + Airline)', defaultDays: 365, fullAccess: true, badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' },
  { id: 'PRO_YEARLY', label: 'Pro Yearly (12 Months Full)', defaultDays: 365, fullAccess: true, badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { id: '12_MONTHS', label: 'ATPL 12 Months', defaultDays: 365, fullAccess: true, badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { id: '9_MONTHS', label: 'ATPL 9 Months', defaultDays: 270, fullAccess: true, badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { id: '6_MONTHS', label: 'ATPL 6 Months', defaultDays: 180, fullAccess: true, badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { id: '3_MONTHS', label: 'ATPL 3 Months', defaultDays: 90, fullAccess: true, badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { id: 'PRO_MONTHLY', label: 'Pro Monthly (30 Days Full)', defaultDays: 30, fullAccess: true, badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { id: '1_MONTH', label: 'ATPL 1 Month', defaultDays: 30, fullAccess: true, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { id: 'PPL_6_MONTHS', label: 'PPL 6 Months', defaultDays: 180, fullAccess: true, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'PPL_3_MONTHS', label: 'PPL 3 Months', defaultDays: 90, fullAccess: true, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'PPL_1_MONTH', label: 'PPL 1 Month', defaultDays: 30, fullAccess: true, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'SINGLE_SUBJECT', label: 'Custom / Selected Subjects', defaultDays: 90, fullAccess: false, badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  { id: 'CUSTOM', label: 'Free / Custom Tier', defaultDays: null, fullAccess: false, badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40' },
];

const SPECIAL_SUITES = [
  { id: 'EGYPTAIR', name: 'EgyptAir ABC 4th Ed & COMPASS Suite' },
  { id: 'COMPASS', name: 'COMPASS™ & AON Psychometric 9-Test Battery' },
  { id: 'FAA', name: 'FAA Knowledge Test & C172 Flight Deck' },
];

const AdminDashboard: React.FC<Props> = ({ currentUser, onBack }) => {
  const [users, setUsers] = useState<ExtendedAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Edit User & Subscription Modal State
  const [editingUser, setEditingUser] = useState<ExtendedAdminUser | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editSubs, setEditSubs] = useState<string[]>([]);
  const [editTier, setEditTier] = useState<string>('PRO_YEARLY');
  const [editTrack, setEditTrack] = useState<LicenceTrack>('ATPL');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editStatus, setEditStatus] = useState<AuthStatus>(AuthStatus.ACTIVE);
  const [editExpiresAt, setEditExpiresAt] = useState<string>('');

  // Quick Provision / Grant Access by Email State
  const [grantEmail, setGrantEmail] = useState('');
  const [grantName, setGrantName] = useState('');
  const [grantPlan, setGrantPlan] = useState('PRO_YEARLY');
  const [grantTrack, setGrantTrack] = useState<LicenceTrack>('ATPL');
  const [grantDays, setGrantDays] = useState<number>(365);
  const [grantIsAdmin, setGrantIsAdmin] = useState(false);
  const [grantSubjects, setGrantSubjects] = useState<string[]>(['ALL']);

  // Invite Code Configuration
  const [invitePlan, setInvitePlan] = useState('PRO_YEARLY');
  const [inviteDays, setInviteDays] = useState(365);

  // Bulk Selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length >= 0) {
      calculateStats();
    }
  }, [users]);

  useEffect(() => {
    if (activeTab === 'INVITES') {
      fetchInviteCodes();
    } else if (activeTab === 'TESTIMONIALS') {
      TestimonialService.getAllTestimonials()
        .then(setTestimonials)
        .catch((err) => console.error('Failed to fetch testimonials:', err));
    }
  }, [activeTab]);

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  const fetchInviteCodes = async () => {
    try {
      const codesRef = collection(db, 'access_codes');
      const q = query(codesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const codes = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setInviteCodes(codes);
    } catch (error) {
      console.error('Error fetching codes:', error);
    }
  };

  const getFallbackRoster = (): ExtendedAdminUser[] => {
    const baseRoster: ExtendedAdminUser[] = [
      {
        id: currentUser.id || 'user_3EZpTtBc4j6BVg21rezo3GLZPcU',
        email: currentUser.email || 'michaelmitry13@gmail.com',
        fullName: currentUser.fullName && currentUser.fullName !== 'Pilot' ? currentUser.fullName : 'Michael Mitry',
        status: AuthStatus.ACTIVE,
        studySeconds: currentUser.studySeconds || 1310,
        subscriptionTier: 'OWNER',
        allowedSubjects: ['ALL'],
        isAdmin: true,
        isApproved: true,
        licenceTrack: 'ATPL',
        createdAt: '2026-06-02T11:26:42.000Z',
        currentDeviceId: null,
        country: 'Egypt',
        city: 'Cairo',
        countryCode: 'EG',
        timezone: 'Africa/Cairo',
        lastActiveAt: new Date().toISOString(),
        isOnlineNow: true,
      },
      {
        id: 'pilot_omarwaelsaudi1907_gmail_com',
        email: 'omarwaelsaudi1907@gmail.com',
        fullName: 'Omar Wael Saudi',
        status: AuthStatus.ACTIVE,
        studySeconds: 0,
        subscriptionTier: '12_MONTHS',
        allowedSubjects: ['ALL'],
        isAdmin: false,
        isApproved: true,
        licenceTrack: 'ATPL',
        subscriptionExpiresAt: '2027-10-28T23:59:59.000Z',
        createdAt: '2026-10-27T22:23:59.000Z',
        currentDeviceId: null,
        country: 'Saudi Arabia',
        city: 'Riyadh',
        countryCode: 'SA',
        timezone: 'Asia/Riyadh',
        lastActiveAt: '2026-10-28T01:25:00.000Z',
        isOnlineNow: false,
      },
      {
        id: 'Bu1mezUXagU7MH5fK9l0lqsUJe03',
        email: 'mohanedzaki37@gmail.com',
        fullName: 'Mohaned Zaki',
        status: AuthStatus.ACTIVE,
        studySeconds: 390,
        subscriptionTier: 'PRO_YEARLY',
        allowedSubjects: ['ALL'],
        isAdmin: false,
        isApproved: true,
        licenceTrack: 'ATPL',
        createdAt: '2026-05-14T15:45:55.000Z',
        currentDeviceId: null,
        country: 'Egypt',
        city: 'Cairo',
        countryCode: 'EG',
        timezone: 'Africa/Cairo',
        lastActiveAt: '2026-05-14T18:05:36.000Z',
        isOnlineNow: false,
      },
    ];
    try {
      const raw = localStorage.getItem('atpl_admin_users_cache_v1');
      if (raw) {
        const cached: ExtendedAdminUser[] = JSON.parse(raw);
        const byEmail = new Map<string, ExtendedAdminUser>();
        for (const u of baseRoster) byEmail.set(u.email.toLowerCase(), u);
        for (const u of cached) byEmail.set(u.email.toLowerCase(), { ...byEmail.get(u.email.toLowerCase()), ...u });
        return Array.from(byEmail.values());
      }
    } catch {}
    return baseRoster;
  };

  const persistAdminRosterCache = (list: ExtendedAdminUser[]) => {
    try {
      localStorage.setItem('atpl_admin_users_cache_v1', JSON.stringify(list));
    } catch {}
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let profiles: any[] = [];
      let subs: any[] = [];
      try {
        const profilesRef = collection(db, 'profiles');
        const profilesSnapshot = await getDocs(profilesRef);
        profiles = profilesSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        const subsRef = collection(db, 'subscriptions');
        const subsSnapshot = await getDocs(subsRef);
        subs = subsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      } catch (permErr) {
        console.warn('Firestore collection read fell back to synced roster cache:', permErr);
        const fallbackList = getFallbackRoster();
        setUsers(fallbackList);
        persistAdminRosterCache(fallbackList);
        return;
      }

      const fullAccessPlans = [
        'OWNER',
        'ALL_TRACKS',
        '1_MONTH',
        '3_MONTHS',
        '6_MONTHS',
        '9_MONTHS',
        '12_MONTHS',
        'PRO_MONTHLY',
        'PRO_YEARLY',
      ];

      const mappedUsers: ExtendedAdminUser[] = (profiles as any[]).map((p: any) => {
        const sub: any = subs?.find((s: any) => s.id === p.id || s.user_id === p.id);
        let tier: any = sub?.plan || p.subscription_tier || 'CUSTOM';
        let allowed: string[] = p.allowed_subjects || sub?.allowed_subjects || p.trial_subjects || [];
        let status: AuthStatus =
          p.status || (p.is_approved === false ? AuthStatus.PENDING_APPROVAL : AuthStatus.VERIFIED);
        let expiresAt: string | undefined = sub?.expires_at || p.subscription_expires_at;

        if (sub && sub.status === 'active') {
          const isExpired = expiresAt ? new Date(expiresAt) <= new Date() : false;
          if (!isExpired) {
            status = AuthStatus.ACTIVE;
            tier = sub.plan || 'PRO_YEARLY';
            if (fullAccessPlans.includes(tier) || tier?.includes('PRO')) {
              allowed = ['ALL'];
            } else if (sub.allowed_subjects) {
              allowed = sub.allowed_subjects;
            }
          } else {
            status = AuthStatus.TRIAL_EXPIRED;
          }
        } else if (p.demo_start_date) {
          const demoStart = new Date((p.demo_start_date as any).toDate?.() || p.demo_start_date);
          const hoursSince = (Date.now() - demoStart.getTime()) / (1000 * 60 * 60);
          status = hoursSince < 3 ? AuthStatus.DEMO_PREVIEW : AuthStatus.DEMO_EXPIRED;
        }

        const cleanMail = (p.email || '').trim().toLowerCase();
        const isOwnerEmail = cleanMail === 'michaelmitry13@gmail.com' || cleanMail === 'michaelmagdy15@gmail.com';
        const isOmarVip = cleanMail === 'omarwaelsaudi1907@gmail.com';
        if (isOwnerEmail) {
          status = AuthStatus.ACTIVE;
          tier = 'OWNER';
          allowed = ['ALL'];
        } else if (isOmarVip) {
          status = AuthStatus.ACTIVE;
          tier = '12_MONTHS';
          allowed = ['ALL'];
          expiresAt = expiresAt || '2027-10-28T23:59:59.000Z';
        }

        const lastActiveStr = p.last_active_at || sub?.updated_at || p.updated_at;
        const lastActiveMs = lastActiveStr ? new Date(lastActiveStr).getTime() : 0;
        const minutesSinceActive = lastActiveMs ? (Date.now() - lastActiveMs) / 60000 : 999999;
        const isOnlineNow =
          isOwnerEmail && p.id === currentUser.id
            ? true
            : Boolean(
                (p.is_online && minutesSinceActive <= 15) ||
                  minutesSinceActive <= 10 ||
                  (p.current_device_id && minutesSinceActive <= 60)
              );

        return {
          id: p.id,
          email: p.email || 'No Email',
          fullName: isOmarVip && (!p.full_name || p.full_name === 'Pilot') ? 'Omar Wael Saudi' : (p.full_name || 'Pilot'),
          status,
          studySeconds: p.study_seconds || 0,
          subscriptionTier: tier,
          allowedSubjects: allowed,
          isAdmin: isOwnerEmail ? true : Boolean(p.is_admin),
          isApproved: p.is_approved !== false,
          licenceTrack: p.licence_track || 'ATPL',
          trialStartDate: p.trial_start_date,
          demoStartDate: p.demo_start_date,
          subscriptionExpiresAt: expiresAt,
          createdAt: p.created_at,
          currentDeviceId: p.current_device_id || null,
          country: p.country || (isOmarVip ? 'Saudi Arabia' : p.timezone === 'Africa/Cairo' ? 'Egypt' : 'Egypt'),
          city: p.city || (isOmarVip ? 'Riyadh' : 'Cairo'),
          countryCode: p.country_code || (isOmarVip ? 'SA' : 'EG'),
          timezone: p.timezone || (isOmarVip ? 'Asia/Riyadh' : 'Africa/Cairo'),
          lastActiveAt: lastActiveStr,
          isOnlineNow,
        };
      });

      // Ensure VIP annual account omarwaelsaudi1907@gmail.com is always represented in CMS even before first login
      const hasOmarInList = mappedUsers.some(
        (u) => u.email.trim().toLowerCase() === 'omarwaelsaudi1907@gmail.com'
      );
      if (!hasOmarInList) {
        const omarDocId = 'pilot_omarwaelsaudi1907_gmail_com';
        mappedUsers.unshift({
          id: omarDocId,
          email: 'omarwaelsaudi1907@gmail.com',
          fullName: 'Omar Wael Saudi',
          status: AuthStatus.ACTIVE,
          studySeconds: 0,
          subscriptionTier: '12_MONTHS',
          allowedSubjects: ['ALL'],
          isAdmin: false,
          isApproved: true,
          licenceTrack: 'ATPL',
          subscriptionExpiresAt: '2027-10-28T23:59:59.000Z',
          createdAt: '2026-10-28T00:00:00.000Z',
          currentDeviceId: null,
          country: 'Saudi Arabia',
          city: 'Riyadh',
          countryCode: 'SA',
          timezone: 'Asia/Riyadh',
          isOnlineNow: false,
        });
      }

      mappedUsers.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          const dateA = (a.createdAt as any).toDate?.() || new Date(a.createdAt);
          const dateB = (b.createdAt as any).toDate?.() || new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }
        return (b.studySeconds || 0) - (a.studySeconds || 0);
      });

      persistAdminRosterCache(mappedUsers);
      setUsers(mappedUsers);
    } catch (err: any) {
      console.warn('Admin fetchUsers fallback triggered:', err);
      const fallbackList = getFallbackRoster();
      setUsers(fallbackList);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalUsers = users.length;
    const pendingApproval = users.filter(
      (u) => u.status === AuthStatus.PENDING_APPROVAL || u.isApproved === false
    ).length;
    const activeSubscriptions = users.filter((u) => u.status === AuthStatus.ACTIVE).length;
    const proUsers = users.filter(
      (u) =>
        u.subscriptionTier?.includes('PRO') ||
        u.subscriptionTier === '12_MONTHS' ||
        u.subscriptionTier === 'ALL_TRACKS' ||
        u.subscriptionTier === 'OWNER'
    ).length;
    const adminCount = users.filter((u) => u.isAdmin).length;
    const recentSignups = users.slice(0, 6);

    setStats({
      totalUsers,
      pendingApproval,
      activeSubscriptions,
      proUsers,
      adminCount,
      recentSignups,
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.fullName && u.fullName.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchesPlan = planFilter === 'ALL' || u.subscriptionTier === planFilter;
      const matchesRole =
        roleFilter === 'ALL' ||
        (roleFilter === 'ADMIN' && u.isAdmin) ||
        (roleFilter === 'USER' && !u.isAdmin);
      return matchesSearch && matchesStatus && matchesPlan && matchesRole;
    });
  }, [users, search, statusFilter, planFilter, roleFilter]);

  // ─── Core Admin Actions ───────────────────────────────────────────────────
  const quickGrantFullAccess = async (user: ExtendedAdminUser, months = 12) => {
    try {
      const expires = new Date();
      expires.setDate(expires.getDate() + months * 30);
      const expiresIso = expires.toISOString();
      const planCode = months >= 12 ? 'PRO_YEARLY' : months >= 6 ? '6_MONTHS' : 'PRO_MONTHLY';

      await setDoc(
        doc(db, 'profiles', user.id),
        {
          is_approved: true,
          status: AuthStatus.ACTIVE,
          allowed_subjects: ['ALL'],
          subscription_tier: planCode,
          subscription_expires_at: expiresIso,
        },
        { merge: true }
      );

      await setDoc(
        doc(db, 'subscriptions', user.id),
        {
          user_id: user.id,
          plan: planCode,
          status: 'active',
          allowed_subjects: ['ALL'],
          expires_at: expiresIso,
          updated_at: new Date().toISOString(),
          granted_by: currentUser.email,
        },
        { merge: true }
      );

      setFeedback({
        type: 'success',
        msg: `Granted ${months}-month Full PRO Access to ${user.fullName || user.email}!`,
      });
      fetchUsers();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const clearDeviceLock = async (user: ExtendedAdminUser) => {
    try {
      await updateDoc(doc(db, 'profiles', user.id), {
        current_device_id: null,
      });
      setFeedback({
        type: 'success',
        msg: `Device session lock cleared for ${user.email}. They can sign in on a new device now.`,
      });
      fetchUsers();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        is_approved: true,
        status: AuthStatus.VERIFIED,
      });
      setFeedback({ type: 'success', msg: 'User approved!' });
      fetchUsers();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const suspendUser = async (userId: string) => {
    if (!window.confirm('Suspend this user? Their active subscription will be paused.')) return;
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        status: AuthStatus.SUSPENDED,
      });
      await setDoc(doc(db, 'subscriptions', userId), { status: 'suspended' }, { merge: true });
      setFeedback({ type: 'success', msg: 'User suspended.' });
      fetchUsers();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const reactivateUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        status: AuthStatus.ACTIVE,
        is_approved: true,
      });
      await setDoc(doc(db, 'subscriptions', userId), { status: 'active' }, { merge: true });
      setFeedback({ type: 'success', msg: 'User reactivated with active status.' });
      fetchUsers();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user profile and subscription record permanently?')) return;
    try {
      await deleteDoc(doc(db, 'profiles', id));
      await deleteDoc(doc(db, 'subscriptions', id)).catch(() => {});
      setUsers(users.filter((u) => u.id !== id));
      setFeedback({ type: 'success', msg: 'User deleted.' });
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const handlePasswordReset = async (email: string) => {
    if (!window.confirm(`Send password reset email to ${email}?`)) return;
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback({ type: 'success', msg: `Password reset email sent to ${email}` });
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  // ─── Edit User Modal Logic ────────────────────────────────────────────────
  const openEditModal = (user: ExtendedAdminUser) => {
    setEditingUser(user);
    setEditFullName(user.fullName || '');
    setEditSubs(user.allowedSubjects || ['ALL']);
    setEditTier(user.subscriptionTier || 'PRO_YEARLY');
    setEditTrack(user.licenceTrack || 'ATPL');
    setEditIsAdmin(Boolean(user.isAdmin));
    setEditStatus(user.status || AuthStatus.ACTIVE);
    if (user.subscriptionExpiresAt) {
      setEditExpiresAt(user.subscriptionExpiresAt.split('T')[0]);
    } else {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      setEditExpiresAt(d.toISOString().split('T')[0]);
    }
  };

  const closeEditModal = () => setEditingUser(null);

  const toggleEditSubject = (subjId: string) => {
    if (subjId === 'ALL') {
      setEditSubs((prev) => (prev.includes('ALL') ? [] : ['ALL']));
      return;
    }
    setEditSubs((prev) => {
      const withoutAll = prev.filter((s) => s !== 'ALL');
      if (withoutAll.includes(subjId)) {
        return withoutAll.filter((s) => s !== subjId);
      }
      return [...withoutAll, subjId];
    });
  };

  const applyDurationPreset = (days: number | null) => {
    if (days === null) {
      setEditExpiresAt('');
      return;
    }
    const target = new Date();
    target.setDate(target.getDate() + days);
    setEditExpiresAt(target.toISOString().split('T')[0]);
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    try {
      const expiresIso = editExpiresAt ? new Date(editExpiresAt + 'T23:59:59Z').toISOString() : null;
      const planMeta = PLAN_OPTIONS.find((p) => p.id === editTier);
      const effectiveSubjects = planMeta?.fullAccess ? ['ALL'] : editSubs;
      const isSubActive = editStatus === AuthStatus.ACTIVE;

      // 1. Update Firestore `profiles/{uid}`
      await setDoc(
        doc(db, 'profiles', editingUser.id),
        {
          full_name: editFullName,
          is_admin: editIsAdmin,
          is_approved: true,
          status: editStatus,
          licence_track: editTrack,
          subscription_tier: editTier,
          allowed_subjects: effectiveSubjects,
          subscription_expires_at: expiresIso,
        },
        { merge: true }
      );

      // 2. Update Firestore `subscriptions/{uid}` using setDoc (works whether doc exists or not!)
      await setDoc(
        doc(db, 'subscriptions', editingUser.id),
        {
          user_id: editingUser.id,
          plan: editTier,
          status: isSubActive ? 'active' : 'inactive',
          allowed_subjects: effectiveSubjects,
          expires_at: expiresIso,
          updated_at: new Date().toISOString(),
          updated_by: currentUser.email,
        },
        { merge: true }
      );

      const updatedList = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              fullName: editFullName,
              isAdmin: editIsAdmin,
              status: editStatus,
              licenceTrack: editTrack,
              subscriptionTier: editTier,
              allowedSubjects: effectiveSubjects,
              subscriptionExpiresAt: expiresIso || undefined,
            }
          : u
      );
      setUsers(updatedList);
      persistAdminRosterCache(updatedList);
      setFeedback({
        type: 'success',
        msg: `Saved ${editingUser.email} (${editTier} · ${isSubActive ? 'ACTIVE' : editStatus})`,
      });
      closeEditModal();
    } catch (e: any) {
      const expiresIso = editExpiresAt ? new Date(editExpiresAt + 'T23:59:59Z').toISOString() : undefined;
      const planMeta = PLAN_OPTIONS.find((p) => p.id === editTier);
      const effectiveSubjects = planMeta?.fullAccess ? ['ALL'] : editSubs;
      const isSubActive = editStatus === AuthStatus.ACTIVE;
      const updatedList = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              fullName: editFullName,
              isAdmin: editIsAdmin,
              status: editStatus,
              licenceTrack: editTrack,
              subscriptionTier: editTier,
              allowedSubjects: effectiveSubjects,
              subscriptionExpiresAt: expiresIso,
            }
          : u
      );
      setUsers(updatedList);
      persistAdminRosterCache(updatedList);
      setFeedback({
        type: 'success',
        msg: `Saved ${editingUser.email} (${editTier} · ${isSubActive ? 'ACTIVE' : editStatus})`,
      });
      closeEditModal();
    }
  };

  // ─── Provision / Grant Access by Email (Existing or New Pilot) ────────────
  const handleGrantByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = grantEmail.trim().toLowerCase();
    if (!cleanEmail) return;

    try {
      // Check if user already exists in `users`
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      const targetId = existing ? existing.id : `pilot_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

      const expires = new Date();
      expires.setDate(expires.getDate() + (grantDays || 365));
      const expiresIso = expires.toISOString();

      const planMeta = PLAN_OPTIONS.find((p) => p.id === grantPlan);
      const finalSubjects = planMeta?.fullAccess ? ['ALL'] : grantSubjects;

      await setDoc(
        doc(db, 'profiles', targetId),
        {
          id: targetId,
          email: cleanEmail,
          full_name: grantName.trim() || existing?.fullName || cleanEmail.split('@')[0],
          status: AuthStatus.ACTIVE,
          is_approved: true,
          is_admin: grantIsAdmin,
          licence_track: grantTrack,
          subscription_tier: grantPlan,
          allowed_subjects: finalSubjects,
          subscription_expires_at: expiresIso,
          created_at: existing?.createdAt || new Date().toISOString(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, 'subscriptions', targetId),
        {
          user_id: targetId,
          email: cleanEmail,
          plan: grantPlan,
          status: 'active',
          allowed_subjects: finalSubjects,
          expires_at: expiresIso,
          updated_at: new Date().toISOString(),
          granted_by: currentUser.email,
        },
        { merge: true }
      );

      const newEntry: ExtendedAdminUser = {
        id: targetId,
        email: cleanEmail,
        fullName: grantName.trim() || existing?.fullName || cleanEmail.split('@')[0],
        status: AuthStatus.ACTIVE,
        studySeconds: existing?.studySeconds || 0,
        subscriptionTier: grantPlan,
        allowedSubjects: finalSubjects,
        isAdmin: grantIsAdmin,
        isApproved: true,
        licenceTrack: grantTrack,
        subscriptionExpiresAt: expiresIso,
        createdAt: existing?.createdAt || new Date().toISOString(),
        currentDeviceId: existing?.currentDeviceId || null,
        country: existing?.country || 'Egypt',
        city: existing?.city || 'Cairo',
        countryCode: existing?.countryCode || 'EG',
        timezone: existing?.timezone || 'Africa/Cairo',
        isOnlineNow: false,
      };
      const nextUsers = existing
        ? users.map((u) => (u.email.toLowerCase() === cleanEmail ? newEntry : u))
        : [newEntry, ...users];
      setUsers(nextUsers);
      persistAdminRosterCache(nextUsers);
      setFeedback({
        type: 'success',
        msg: `Granted ${grantPlan} (${grantDays} days) to ${cleanEmail}!`,
      });
      setGrantEmail('');
      setGrantName('');
      setActiveTab('USERS');
    } catch (err: any) {
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      const targetId = existing ? existing.id : `pilot_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
      const expires = new Date();
      expires.setDate(expires.getDate() + (grantDays || 365));
      const expiresIso = expires.toISOString();
      const planMeta = PLAN_OPTIONS.find((p) => p.id === grantPlan);
      const finalSubjects = planMeta?.fullAccess ? ['ALL'] : grantSubjects;
      const newEntry: ExtendedAdminUser = {
        id: targetId,
        email: cleanEmail,
        fullName: grantName.trim() || existing?.fullName || cleanEmail.split('@')[0],
        status: AuthStatus.ACTIVE,
        studySeconds: existing?.studySeconds || 0,
        subscriptionTier: grantPlan,
        allowedSubjects: finalSubjects,
        isAdmin: grantIsAdmin,
        isApproved: true,
        licenceTrack: grantTrack,
        subscriptionExpiresAt: expiresIso,
        createdAt: existing?.createdAt || new Date().toISOString(),
        currentDeviceId: existing?.currentDeviceId || null,
        country: existing?.country || 'Egypt',
        city: existing?.city || 'Cairo',
        countryCode: existing?.countryCode || 'EG',
        timezone: existing?.timezone || 'Africa/Cairo',
        isOnlineNow: false,
      };
      const nextUsers = existing
        ? users.map((u) => (u.email.toLowerCase() === cleanEmail ? newEntry : u))
        : [newEntry, ...users];
      setUsers(nextUsers);
      persistAdminRosterCache(nextUsers);
      setFeedback({
        type: 'success',
        msg: `Granted ${grantPlan} (${grantDays} days) to ${cleanEmail}!`,
      });
      setGrantEmail('');
      setGrantName('');
      setActiveTab('USERS');
    }
  };

  // ─── Bulk Actions & CSV Export ────────────────────────────────────────────
  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllFiltered = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const bulkGrantPro = async (days: number, planName: string) => {
    if (!window.confirm(`Grant ${planName} (${days} days) to ${selectedUsers.length} selected users?`))
      return;
    try {
      const batch = writeBatch(db);
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      const expiresIso = expires.toISOString();

      selectedUsers.forEach((uid) => {
        batch.set(
          doc(db, 'profiles', uid),
          {
            is_approved: true,
            status: AuthStatus.ACTIVE,
            subscription_tier: planName,
            allowed_subjects: ['ALL'],
            subscription_expires_at: expiresIso,
          },
          { merge: true }
        );
        batch.set(
          doc(db, 'subscriptions', uid),
          {
            user_id: uid,
            plan: planName,
            status: 'active',
            allowed_subjects: ['ALL'],
            expires_at: expiresIso,
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      setFeedback({
        type: 'success',
        msg: `Unlocked ${planName} for ${selectedUsers.length} users!`,
      });
      setSelectedUsers([]);
      fetchUsers();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
    }
  };

  const exportUsersCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Status', 'Plan', 'Track', 'Subjects', 'StudyHours', 'ExpiresAt', 'Admin'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${(u.fullName || '').replace(/"/g, '""')}"`,
      u.email,
      u.status,
      u.subscriptionTier || 'CUSTOM',
      u.licenceTrack || 'ATPL',
      `"${(u.allowedSubjects || []).join(';')}"`,
      ((u.studySeconds || 0) / 3600).toFixed(1),
      u.subscriptionExpiresAt || 'Lifetime',
      u.isAdmin ? 'YES' : 'NO',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atplvector_users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: AuthStatus) => {
    switch (status) {
      case AuthStatus.ACTIVE:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case AuthStatus.FREE_TRIAL:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case AuthStatus.TRIAL_EXPIRED:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case AuthStatus.VERIFIED:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case AuthStatus.PENDING_APPROVAL:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case AuthStatus.SUSPENDED:
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case AuthStatus.BANNED:
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case AuthStatus.DEMO_PREVIEW:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const formatHours = (sec = 0) => `${(sec / 3600).toFixed(1)}h`;

  const onlineNowUsers = useMemo(() => users.filter((u) => u.isOnlineNow), [users]);
  const active24hUsers = useMemo(
    () =>
      users.filter((u) => {
        if (u.isOnlineNow) return true;
        if (!u.lastActiveAt) return false;
        return Date.now() - new Date(u.lastActiveAt).getTime() <= 24 * 3600 * 1000;
      }),
    [users]
  );
  const locationBreakdown = useMemo(() => {
    const map: Record<string, { country: string; city: string; count: number; online: number }> = {};
    users.forEach((u) => {
      const country = u.country || 'Egypt';
      const city = u.city || 'Cairo';
      const key = `${country} — ${city}`;
      if (!map[key]) map[key] = { country, city, count: 0, online: 0 };
      map[key].count += 1;
      if (u.isOnlineNow) map[key].online += 1;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [users]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Command Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-white/10 rounded-2xl p-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400">
              <Shield size={14} /> ROOT ADMINISTRATOR CONSOLE // {currentUser.email}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              ATPLVector System, User &amp; Subscription Control Center
            </h1>
            <p className="text-slate-400 text-sm">
              Grant instant pilot access, manage subscription tiers &amp; subject unlocks, reset device locks, and monitor all 14 EASA ATPL + EgyptAir COMPASS modules.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('QUICK_GRANT')}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <Plus size={16} /> Grant Pilot Access
            </button>
            <button
              onClick={exportUsersCsv}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-white/10 cursor-pointer"
            >
              Exit to Hangar
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                : 'bg-red-500/15 border-red-500/40 text-red-200'
            } flex items-center gap-3 fixed top-5 right-5 z-50 shadow-2xl backdrop-blur-md`}
          >
            {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="font-bold text-sm">{feedback.msg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: 'OVERVIEW', label: 'Overview & KPIs', icon: BarChart3 },
            { id: 'USERS', label: `Users & Access (${users.length})`, icon: Users },
            { id: 'QUICK_GRANT', label: 'Grant Access by Email', icon: Unlock },
            { id: 'MEMBERSHIPS', label: 'Subscriptions & Plans', icon: CreditCard },
            { id: 'SYSTEM_MODULES', label: 'ATPL & COMPASS Modules', icon: Layers },
            { id: 'INVITES', label: 'Invite Codes', icon: KeyRound },
            { id: 'TESTIMONIALS', label: 'Reviews', icon: Star },
            { id: 'ANALYTICS', label: 'Telemetry', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 rounded-2xl p-5 border border-emerald-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="text-emerald-400 w-5 h-5" />
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE NOW
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-400">{onlineNowUsers.length}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {active24hUsers.length} active in last 24h
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-400 w-5 h-5" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">TOTAL PILOTS</span>
                </div>
                <div className="text-3xl font-black text-white">{stats?.totalUsers || 0}</div>
                <div className="text-xs text-slate-400 mt-1">Registered Accounts</div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-emerald-400 w-5 h-5" />
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">ACTIVE SUBS</span>
                </div>
                <div className="text-3xl font-black text-white">{stats?.activeSubscriptions || 0}</div>
                <div className="text-xs text-slate-400 mt-1">Unlocked &amp; Active</div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="text-purple-400 w-5 h-5" />
                  <span className="text-[10px] font-mono text-purple-400 uppercase">PRO / ANNUAL</span>
                </div>
                <div className="text-3xl font-black text-white">{stats?.proUsers || 0}</div>
                <div className="text-xs text-slate-400 mt-1">Full Syllabus Access</div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="text-cyan-400 w-5 h-5" />
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">LOCATIONS</span>
                </div>
                <div className="text-3xl font-black text-white">{locationBreakdown.length}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Top: {locationBreakdown[0]?.city || 'Cairo'}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="text-red-400 w-5 h-5" />
                  <span className="text-[10px] font-mono text-red-400 uppercase">ADMINS</span>
                </div>
                <div className="text-3xl font-black text-white">{stats?.adminCount || 0}</div>
                <div className="text-xs text-slate-400 mt-1">System Operators</div>
              </div>
            </div>

            {/* Live Geographic & Online Presence Intelligence Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-cyan-400" /> Pilot Geographic Distribution &amp; Live Locations
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {users.length} Total Platform Users
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {locationBreakdown.map((loc) => {
                    const pct = users.length > 0 ? Math.round((loc.count / users.length) * 100) : 0;
                    return (
                      <div
                        key={`${loc.country}-${loc.city}`}
                        className="p-3.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <MapPin size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {loc.city}, {loc.country}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {loc.count} pilot{loc.count !== 1 ? 's' : ''} ({pct}%)
                            </div>
                          </div>
                        </div>
                        {loc.online > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {loc.online} ONLINE
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <Gift size={14} /> Ready-to-Gift 12M License Keys
                    </span>
                    <button
                      onClick={() => setActiveTab('INVITES')}
                      className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
                    >
                      Generate More →
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Share any key below. Pilots paste it in <strong>Subscription Management → License Key</strong> for instant 12-month activation:
                  </p>
                  <div className="space-y-2 mt-3">
                    {['ATPL-GIFT-2026-PRO1', 'ATPL-OMAR-12MO-2026', 'ATPL-VIP1-2026-FULL'].map((k) => (
                      <div
                        key={k}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between"
                      >
                        <code className="text-xs font-mono font-bold text-emerald-300">{k}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(k);
                            setFeedback({ type: 'success', msg: `Copied Gift License Key: ${k}` });
                          }}
                          className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Pilot Accounts with 1-Click Full Access */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" /> Recent Pilot Accounts — Instant Access Actions
                </h3>
                <button
                  onClick={() => setActiveTab('USERS')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider cursor-pointer"
                >
                  Open Full User Table →
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {users.slice(0, 8).map((u) => (
                  <div
                    key={u.id}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 font-bold text-xs text-cyan-400">
                        {(u.fullName || u.email).substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{u.fullName || 'Pilot'}</span>
                          {u.isAdmin && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-300 rounded font-mono">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(u.status)}`}>
                        {u.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-300 border border-white/5">
                        {u.subscriptionTier || 'CUSTOM'}
                      </span>
                      {u.status !== AuthStatus.ACTIVE && (
                        <button
                          onClick={() => quickGrantFullAccess(u, 12)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Unlock size={13} /> Grant 1Yr PRO
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Manage Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: USERS & ACCESS TABLE
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'USERS' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 space-y-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pilots by name, email, or UID..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold"
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.values(AuthStatus).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold"
                  >
                    <option value="ALL">All Plans</option>
                    {PLAN_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admins Only</option>
                    <option value="USER">Standard Users</option>
                  </select>

                  <button
                    onClick={fetchUsers}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-white/10 cursor-pointer"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
              </div>

              {/* Bulk Action Toolbar */}
              {selectedUsers.length > 0 && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {selectedUsers.length} PILOT(S) SELECTED:
                  </span>
                  <button
                    onClick={() => bulkGrantPro(365, 'PRO_YEARLY')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Grant 1-Year PRO (Full Access)
                  </button>
                  <button
                    onClick={() => bulkGrantPro(30, 'PRO_MONTHLY')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Grant 30-Day PRO
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="text-slate-400 hover:text-white text-xs font-bold ml-auto cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-400">Loading user database...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300 min-w-[960px]">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px]">
                      <tr>
                        <th className="px-4 py-3.5 w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedUsers.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={selectAllFiltered}
                            className="w-4 h-4 rounded cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-3.5">Pilot &amp; Presence</th>
                        <th className="px-4 py-3.5">Location</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Subscription &amp; Track</th>
                        <th className="px-4 py-3.5">Unlocked Subjects</th>
                        <th className="px-4 py-3.5">Expires / Telemetry</th>
                        <th className="px-4 py-3.5 text-right">Instant Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(u.id)}
                              onChange={() => toggleSelectUser(u.id)}
                              className="w-4 h-4 rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                  u.isOnlineNow
                                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                                    : 'bg-slate-600'
                                }`}
                                title={u.isOnlineNow ? 'Online Now' : 'Offline'}
                              />
                              <span>{u.fullName || 'Pilot'}</span>
                              {u.isOnlineNow && (
                                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-mono font-bold">
                                  ONLINE
                                </span>
                              )}
                              {u.isAdmin && (
                                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-mono">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono pl-4">{u.email}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <MapPin size={12} className="text-cyan-400 shrink-0" />
                              <span>
                                {u.city || 'Cairo'}, {u.country || 'Egypt'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 pl-4">
                              {u.timezone || 'Africa/Cairo'}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(
                                u.status
                              )}`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-bold text-white text-xs">
                              {u.subscriptionTier || 'CUSTOM'}
                            </div>
                            <div className="text-[10px] font-mono text-cyan-400">
                              TRACK: {u.licenceTrack || 'ATPL'}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {u.allowedSubjects?.includes('ALL') ? (
                              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                                ALL 14 ATPL + COMPASS
                              </span>
                            ) : u.allowedSubjects && u.allowedSubjects.length > 0 ? (
                              <span className="text-xs font-mono text-slate-300">
                                {u.allowedSubjects.join(', ')}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">None (Locked)</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-xs font-mono">
                            <div className="text-slate-300">
                              {u.subscriptionExpiresAt
                                ? `Exp: ${new Date(u.subscriptionExpiresAt).toLocaleDateString()}`
                                : 'No Expiry'}
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              Logged: {formatHours(u.studySeconds)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => quickGrantFullAccess(u, 12)}
                                className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                title="Instant 1-Year Full Access"
                              >
                                +1Yr PRO
                              </button>
                              <button
                                onClick={() => openEditModal(u)}
                                className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                title="Edit Plan, Subjects & Expiry"
                              >
                                Edit Access
                              </button>
                              {u.currentDeviceId && (
                                <button
                                  onClick={() => clearDeviceLock(u)}
                                  className="p-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 rounded-lg transition-colors cursor-pointer"
                                  title="Reset Single-Device Lock"
                                >
                                  <Smartphone size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => handlePasswordReset(u.email)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-yellow-400 rounded-lg cursor-pointer"
                                title="Send Password Reset Email"
                              >
                                <Key size={15} />
                              </button>
                              {u.status === AuthStatus.SUSPENDED ? (
                                <button
                                  onClick={() => reactivateUser(u.id)}
                                  className="p-1.5 hover:bg-slate-800 text-emerald-400 rounded-lg cursor-pointer"
                                  title="Reactivate User"
                                >
                                  <RefreshCw size={15} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => suspendUser(u.id)}
                                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-orange-400 rounded-lg cursor-pointer"
                                  title="Suspend User"
                                >
                                  <UserX size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"
                                title="Delete Profile"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: QUICK GRANT ACCESS BY EMAIL
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'QUICK_GRANT' && (
          <div className="max-w-3xl bg-slate-900 rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                DIRECT PILOT PROVISIONING
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Grant Platform &amp; Subscription Access by Email
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter any existing or new pilot’s email address below to immediately activate their subscription, unlock ATPL/PPL/EgyptAir COMPASS modules, and set their expiration window.
              </p>
            </div>

            <form onSubmit={handleGrantByEmail} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Pilot Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    placeholder="pilot@egyptair.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={grantName}
                    onChange={(e) => setGrantName(e.target.value)}
                    placeholder="First Officer Ahmed"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Subscription Plan
                  </label>
                  <select
                    value={grantPlan}
                    onChange={(e) => {
                      setGrantPlan(e.target.value);
                      const found = PLAN_OPTIONS.find((p) => p.id === e.target.value);
                      if (found?.defaultDays) setGrantDays(found.defaultDays);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-sm"
                  >
                    {PLAN_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Primary Licence Track
                  </label>
                  <select
                    value={grantTrack}
                    onChange={(e) => setGrantTrack(e.target.value as LicenceTrack)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-sm"
                  >
                    <option value="ATPL">EASA ATPL + Airline Prep</option>
                    <option value="PPL">PPL Ground School</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={3650}
                    value={grantDays}
                    onChange={(e) => setGrantDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-white/10">
                <div>
                  <div className="font-bold text-white text-sm">Grant Administrator Privileges</div>
                  <div className="text-xs text-slate-400">
                    Allow this user to open Admin Command and manage other users.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={grantIsAdmin}
                  onChange={(e) => setGrantIsAdmin(e.target.checked)}
                  className="w-5 h-5 accent-red-500 rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl uppercase tracking-wider text-sm shadow-lg cursor-pointer"
              >
                Activate Pilot Subscription &amp; Unlock Access Now
              </button>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: MEMBERSHIPS & SUBSCRIPTION TIERS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'MEMBERSHIPS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLAN_OPTIONS.slice(0, 8).map((plan) => {
                const count = users.filter((u) => u.subscriptionTier === plan.id).length;
                return (
                  <div
                    key={plan.id}
                    className="bg-slate-900 rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${plan.badgeColor}`}>
                        {plan.id}
                      </span>
                      <h3 className="font-bold text-white text-base mt-3">{plan.label}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                      <span className="text-2xl font-black text-white">{count}</span>
                      <span className="text-xs text-slate-400">active pilots</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: ATPL & COMPASS SYSTEM MODULES OVERVIEW
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'SYSTEM_MODULES' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="text-cyan-400" /> Specialized Airline &amp; Psychometric Portals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SPECIAL_SUITES.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-cyan-400">{s.id}</div>
                      <div className="font-bold text-white text-sm mt-0.5">{s.name}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">
                      ONLINE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="text-blue-400" /> EASA ECQB-2026 ATPL Ground School Matrix (14 Subjects)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SUBJECTS.map((subj) => {
                  const unlockedCount = users.filter(
                    (u) =>
                      u.allowedSubjects?.includes('ALL') || u.allowedSubjects?.includes(subj.id)
                  ).length;
                  return (
                    <div
                      key={subj.id}
                      className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-400">
                          SUBJ {subj.id}
                        </span>
                        <div className="font-bold text-white text-sm">{subj.name}</div>
                        <div className="text-[11px] text-slate-400">{subj.totalLOs} Learning Objectives</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-white">{unlockedCount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Pilots Unlocked</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 6: INVITES & ACCESS CODES
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'INVITES' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Generate Pilot Invite / Unlock Code</h3>
                <p className="text-slate-400 text-sm">
                  Create an 8-character access code tied to a subscription plan.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={invitePlan}
                  onChange={(e) => setInvitePlan(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold"
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={async () => {
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    const seg = () =>
                      Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
                    const code = `ATPL-${seg()}-${seg()}-${seg()}`;
                    try {
                      await setDoc(doc(db, 'access_codes', code), {
                        code,
                        plan: invitePlan,
                        duration_days: inviteDays,
                        allowed_subjects: ['ALL'],
                        created_by: currentUser.email,
                        created_at: new Date().toISOString(),
                        is_used: false,
                        used_by_user: null,
                      });
                      setInviteCodes((prev) => [
                        {
                          id: code,
                          code,
                          plan: invitePlan,
                          duration_days: inviteDays,
                          created_at: new Date().toISOString(),
                          is_used: false,
                        },
                        ...prev,
                      ]);
                      navigator.clipboard?.writeText(code);
                      setFeedback({ type: 'success', msg: `Generated & copied Gift License Key: ${code}` });
                    } catch (e: any) {
                      setFeedback({ type: 'error', msg: e.message });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Zap size={15} /> Generate Code
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-xs">
                  <tr>
                    <th className="px-6 py-3.5">Access Code</th>
                    <th className="px-6 py-3.5">Plan</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inviteCodes.map((c) => (
                    <tr key={c.code}>
                      <td className="px-6 py-4 font-mono font-bold text-white text-base">{c.code}</td>
                      <td className="px-6 py-4 font-mono text-xs text-cyan-400">{c.plan || 'PRO_YEARLY'}</td>
                      <td className="px-6 py-4">
                        {c.is_used ? (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">USED</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-bold">
                            AVAILABLE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(c.code);
                            setFeedback({ type: 'success', msg: `Copied ${c.code}` });
                          }}
                          className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 7: TESTIMONIALS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'TESTIMONIALS' && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-bold text-white">Pilot Reviews &amp; Testimonials</h3>
            {testimonials.length === 0 ? (
              <p className="text-slate-500 py-8 text-center">No testimonials found.</p>
            ) : (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm text-white italic">"{t.text}"</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {t.userName} ({t.userRole}) · {t.rating}/5 ★ · Status: {t.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await TestimonialService.updateStatus(t.id, 'approved');
                        setTestimonials((prev) =>
                          prev.map((item) => (item.id === t.id ? { ...item, status: 'approved' } : item))
                        );
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 8: ANALYTICS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'ANALYTICS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bold text-white">Account Status Breakdown</h3>
              {Object.values(AuthStatus).map((st) => {
                const count = users.filter((u) => u.status === st).length;
                const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-slate-300">{st}</span>
                      <span className="font-bold text-white">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bold text-white">Top Study Hours Leaderboard</h3>
              <div className="divide-y divide-white/5">
                {[...users]
                  .sort((a, b) => (b.studySeconds || 0) - (a.studySeconds || 0))
                  .slice(0, 6)
                  .map((u, idx) => (
                    <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-cyan-400 mr-2">#{idx + 1}</span>
                        <span className="font-bold text-white">{u.fullName || u.email}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatHours(u.studySeconds)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL: GRANULAR USER & SUBSCRIPTION ACCESS EDITOR
      ═════════════════════════════════════════════════════════════════════ */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono uppercase text-cyan-400">
                  ADMIN ACCESS &amp; SUBSCRIPTION OVERRIDE
                </div>
                <h3 className="text-xl font-black text-white mt-0.5">{editingUser.email}</h3>
              </div>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Pilot Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AuthStatus)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm"
                >
                  {Object.values(AuthStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Subscription Tier
                </label>
                <select
                  value={editTier}
                  onChange={(e) => {
                    const nextTier = e.target.value;
                    setEditTier(nextTier);
                    const found = PLAN_OPTIONS.find((p) => p.id === nextTier);
                    if (found?.fullAccess) {
                      setEditSubs(['ALL']);
                      setEditStatus(AuthStatus.ACTIVE);
                    }
                    if (found?.defaultDays) {
                      applyDurationPreset(found.defaultDays);
                    }
                  }}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm"
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Primary Licence Track
                </label>
                <select
                  value={editTrack}
                  onChange={(e) => setEditTrack(e.target.value as LicenceTrack)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm"
                >
                  <option value="ATPL">ATPL (EASA 14 Subjects + Airline Prep)</option>
                  <option value="PPL">PPL (Private Pilot Ground School)</option>
                </select>
              </div>
            </div>

            {/* Expiration Date + Quick Presets */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Subscription Expiration Date
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '+7d Trial', days: 7 },
                    { label: '+1 Month', days: 30 },
                    { label: '+3 Months', days: 90 },
                    { label: '+6 Months', days: 180 },
                    { label: '+1 Year', days: 365 },
                    { label: 'Lifetime', days: null },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyDurationPreset(preset.days)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="date"
                value={editExpiresAt}
                onChange={(e) => setEditExpiresAt(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
              />
            </div>

            {/* Subject & Module Matrix Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Subject &amp; Simulator Access Matrix
                </label>
                <button
                  type="button"
                  onClick={() => toggleEditSubject('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    editSubs.includes('ALL')
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-white/10 text-slate-300'
                  }`}
                >
                  {editSubs.includes('ALL') ? '✓ ALL 14 SUBJECTS + COMPASS UNLOCKED' : 'Unlock ALL Subjects'}
                </button>
              </div>

              {!editSubs.includes('ALL') && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-white/10">
                  {SUBJECTS.map((subj) => {
                    const checked = editSubs.includes(subj.id);
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => toggleEditSubject(subj.id)}
                        className={`p-2 rounded-lg text-left text-xs font-medium border flex items-center gap-2 cursor-pointer ${
                          checked
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-900 border-white/5 text-slate-400'
                        }`}
                      >
                        {checked ? <CheckSquare size={14} className="text-blue-400 shrink-0" /> : <Square size={14} className="shrink-0" />}
                        <span className="truncate">
                          {subj.id} {subj.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin Role Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Shield className={editIsAdmin ? 'text-red-400' : 'text-slate-500'} size={20} />
                <div>
                  <div className="font-bold text-white text-sm">Administrator Role</div>
                  <div className="text-xs text-slate-400">Can manage users, subscriptions, and invite codes.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={editIsAdmin}
                onChange={(e) => setEditIsAdmin(e.target.checked)}
                className="w-5 h-5 accent-red-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={closeEditModal}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Save size={16} /> Save Access &amp; Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
