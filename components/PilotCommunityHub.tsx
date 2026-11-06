import React, { useState, useEffect, useMemo } from 'react';
import { User, View } from '../types';
import { db, collection, doc } from '../lib/firebase';
import {
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Plus,
  Search,
  Pin,
  CheckCircle2,
  Shield,
  Users,
  Compass,
  Plane,
  BookOpen,
  Award,
  Sparkles,
  Trash2,
  ArrowLeft,
  Clock,
  Tag,
  MessageCircle,
  Flame,
  Filter,
} from 'lucide-react';

interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  authorLocation?: string;
  isAdmin?: boolean;
  content: string;
  createdAt: string;
  upvotes: string[];
  isAcceptedAnswer?: boolean;
}

interface ForumThread {
  id: string;
  title: string;
  content: string;
  category:
    | 'ALL'
    | 'COMPASS_AON'
    | 'EGYPTAIR_PREP'
    | 'ATPL_SUBJECTS'
    | 'SIM_CHECK'
    | 'STUDY_PARTNERS'
    | 'CAREER_ADVICE';
  subjectTag?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  authorLocation?: string;
  isAdmin?: boolean;
  createdAt: string;
  upvotes: string[];
  isPinned?: boolean;
  isSolved?: boolean;
  replies: ForumReply[];
}

interface Props {
  user: User;
  onChangeView?: (view: View) => void;
  onBack?: () => void;
}

const CATEGORIES: {
  id: ForumThread['category'];
  label: string;
  badgeColor: string;
  icon: any;
  desc: string;
}[] = [
  {
    id: 'ALL',
    label: 'All Channels',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: MessageSquare,
    desc: 'All pilot discussions across ATPL, COMPASS, and Airline Recruitment',
  },
  {
    id: 'COMPASS_AON',
    label: 'COMPASS™ & AON Psychometrics',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    icon: Compass,
    desc: 'Orientation 5x5 RBI/Horizon/Compass grid, Memory, Control Task & Stanine tips',
  },
  {
    id: 'EGYPTAIR_PREP',
    label: 'EgyptAir & Airline Interviews',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: Plane,
    desc: 'EgyptAir ABC 4th Ed, ECARs, HR & Technical Board feedback, Gulf & EU carriers',
  },
  {
    id: 'ATPL_SUBJECTS',
    label: 'EASA 14 ATPL Subjects Q&A',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: BookOpen,
    desc: '010 Air Law through 090 Comms — explain tough ECQB questions & formulas',
  },
  {
    id: 'SIM_CHECK',
    label: 'Simulator Assessment &MCC/JOC',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Award,
    desc: 'Raw-data ILS pitches, thrust settings, callouts, and CRM group exercises',
  },
  {
    id: 'STUDY_PARTNERS',
    label: 'Study Squads & Crew Pairing',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: Users,
    desc: 'Find a virtual simulator partner or local ground-school study buddy',
  },
];

const SEED_THREADS: ForumThread[] = [
  {
    id: 'seed-compass-orientation-rbi',
    title: 'How to solve the 5x5 COMPASS Orientation Grid (RBI + Artificial Horizon + Compass) in under 8 seconds?',
    content: `Hey everyone! I have my EgyptAir COMPASS screening coming up next week and I've been practicing the 9-module COMPASS suite here on ATPLVector.\n\nOn the Orientation test (where you match the RBI, Artificial Horizon, and Gyro Compass to the 5x5 aircraft grid around the NDB beacon), what's the fastest mental workflow you use?\n\nRight now I:\n1. Look at the Gyro Compass heading first to filter the aircraft orientation (N, NE, E, SE, S, SW, W, NW).\n2. Check the RBI needle tail/head to find which quadrant of the 5x5 grid the aircraft is in.\n3. Verify pitch/bank on the Artificial Horizon.\n\nAnyone hitting Stanine 8–9 consistently have tips for not getting tripped up when heading is South (180°) and RBI relative bearing is 090°?`,
    category: 'COMPASS_AON',
    subjectTag: 'COMPASS Orientation',
    authorId: 'pilot_omarwaelsaudi1907_gmail_com',
    authorName: 'F/O Omar Wael Saudi',
    authorEmail: 'omarwaelsaudi1907@gmail.com',
    authorRole: 'ATPL Yearly Pro · Cairo, Egypt',
    authorLocation: 'Cairo, Egypt',
    createdAt: '2026-10-27T18:30:00.000Z',
    upvotes: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'],
    isPinned: true,
    isSolved: true,
    replies: [
      {
        id: 'reply-1',
        authorId: 'admin-michael',
        authorName: 'Capt. Michael Mitry',
        authorEmail: 'michaelmitry13@gmail.com',
        authorRole: 'Chief Flight Instructor · Admin',
        authorLocation: 'Cairo, Egypt',
        isAdmin: true,
        content: `Great question Omar! The golden rule for the COMPASS 5x5 NDB Grid is **QDM = Magnetic Heading + Relative Bearing (RBI)**.\n\nInstead of mentally rotating the aircraft on the grid:\n1. **Eliminate by Heading first**: Only 2 or 3 planes in the 5x5 grid share that exact nose heading.\n2. **Use the RBI Arrowhead as a pointer**: Imagine sitting in that candidate plane on the grid — does the NDB station sit Dead Ahead (360°), Right Wingtip (090°), Behind (180°), or Left Wingtip (270°)?\n   - Example: If Heading = 180° (flying South) and RBI = 090° (station is off your RIGHT wing), looking South your right wing points **West (Left side of screen)**. Since the NDB is in the center of the 5x5 grid, the aircraft must be on the **East column (Right side of the NDB)** looking South!\n3. Always confirm Bank Angle (Left/Right bank) last.`,
        createdAt: '2026-10-27T19:10:00.000Z',
        upvotes: ['user_1', 'user_2', 'user_3'],
        isAcceptedAnswer: true,
      },
      {
        id: 'reply-2',
        authorId: 'pilot-karim',
        authorName: 'Karim Hassan',
        authorEmail: 'karim.hassan@pilot.eg',
        authorRole: 'CPL/IR Frozen ATPL · Alexandria',
        authorLocation: 'Alexandria, Egypt',
        content: `What helped me jump from 65% to 95% accuracy on the ATPLVector COMPASS simulator was doing 15 minutes of Orientation right before 15 minutes of Task Manager every morning. Filtering by aircraft nose heading first cuts the 24 cells down to 3 candidates immediately!`,
        createdAt: '2026-10-27T20:45:00.000Z',
        upvotes: ['user_1'],
      },
    ],
  },
  {
    id: 'seed-egyptair-abc-fuel-holding',
    title: 'EgyptAir ABC 4th Edition Technical Exam — Most Frequent Topics & Holding Speed Limits',
    content: `Sharing my study breakdown from the EgyptAir cadet technical prep! Make sure you know:\n\n• **ICAO Holding Speeds (Doc 8168)** vs FAA holding speeds (230 kt up to 14,000 ft in ICAO!).\n• **Jeppesen Approach Chart Briefing Strip**: Difference between DA(H) and MDA(H), and when CDFA eliminates the +50 ft addition.\n• **032 Performance**: Balanced V1 when runway is contaminated (V1 reduced toward VMCG) and climb gradient vs rate of climb formulas.\n• **021 Hydraulics & Electrics**: Constant Speed Drive (CSD) disconnect rules (only resettable on the ground!).\n\nFeel free to drop any tricky ABC 4th Ed questions in this thread and let's solve them together!`,
    category: 'EGYPTAIR_PREP',
    subjectTag: 'EgyptAir ABC 4th Ed',
    authorId: 'admin-michael',
    authorName: 'Capt. Michael Mitry',
    authorEmail: 'michaelmitry13@gmail.com',
    authorRole: 'Chief Flight Instructor · Admin',
    authorLocation: 'Cairo, Egypt',
    isAdmin: true,
    createdAt: '2026-10-26T15:00:00.000Z',
    upvotes: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5', 'user_6', 'user_7'],
    isPinned: true,
    isSolved: false,
    replies: [
      {
        id: 'reply-egyptair-1',
        authorId: 'pilot-nour',
        authorName: 'Nour El-Din',
        authorEmail: 'nour.aviation@gmail.com',
        authorRole: 'Airline Cadet Applicant · Giza',
        authorLocation: 'Giza, Egypt',
        content: `Thank you Captain! Quick question on Jeppesen Approach Minimums: If approach lights are ALS out, how much RVR do we add on a Non-Precision Approach vs CAT I ILS?`,
        createdAt: '2026-10-27T11:20:00.000Z',
        upvotes: ['user_2'],
      },
    ],
  },
  {
    id: 'seed-061-gen-nav-grid-convergence',
    title: '061 General Navigation: Easy Trick for Convergence & Conversion Angle (N/S Hemisphere)',
    content: `If anyone struggles with Great Circle vs Rhumb Line tracks in 061 Gen Nav, remember the **DI-CA** visual rule:\n\n• In the **Northern Hemisphere**, Great Circle is always Poleward (North) of the Rhumb Line.\n• Going **Eastbound** in the North: Initial GC track < Rhumb Line track < Final GC track (Track **Increases**).\n• Going **Westbound** in the North: Track **Decreases**.\n• Formula: $\\text{Convergence} = \\text{Change of Longitude} \\times \\sin(\\text{Mean Latitude})$ and $\\text{Conversion Angle} = \\frac{1}{2} \\times \\text{Convergence}$.`,
    category: 'ATPL_SUBJECTS',
    subjectTag: '061 Gen Nav',
    authorId: 'pilot-tariq',
    authorName: 'Tariq Al-Mansoor',
    authorEmail: 'tariq.pilot@aviation.ae',
    authorRole: 'ATPL Student · Dubai, UAE',
    authorLocation: 'Dubai, UAE',
    createdAt: '2026-10-25T14:15:00.000Z',
    upvotes: ['user_1', 'user_2', 'user_3', 'user_4'],
    isPinned: false,
    isSolved: true,
    replies: [],
  },
  {
    id: 'seed-sim-check-pitch-power',
    title: 'Raw Data Boeing 737 / Airbus A320 Simulator Assessment — Pitch & Power Table',
    content: `For anyone preparing for the airline simulator check (FBS / FFS without Flight Director), keeping a stable scan with reliable baseline Pitch & Power settings saves 80% of workload:\n\n• **Level Flight Clean 250 kt**: Pitch +2.5°, N1 ~58%\n• **Level Flight Flaps 5 (180 kt)**: Pitch +4.5°, N1 ~62%\n• **ILS 3° Glidepath Flaps 30 (Vref + 5)**: Pitch +2.0° to +2.5°, N1 ~55–58%\n• **Go-Around**: Pitch +15° initially, TOGA thrust, Flaps 15, Positive Rate -> Gear Up.\n\nWho wants to pair up on Discord/Zoom this evening for standard callout & QRH memory item drills?`,
    category: 'SIM_CHECK',
    subjectTag: 'Sim Assessment',
    authorId: 'pilot-youssef',
    authorName: 'Youssef Adel',
    authorEmail: 'youssef.adel@fly.eg',
    authorRole: 'CPL/IR MCC · Cairo, Egypt',
    authorLocation: 'Cairo, Egypt',
    createdAt: '2026-10-24T17:00:00.000Z',
    upvotes: ['user_1', 'user_2', 'user_3'],
    isPinned: false,
    isSolved: false,
    replies: [],
  },
];

const PilotCommunityHub: React.FC<Props> = ({ user, onChangeView, onBack }) => {
  const [threads, setThreads] = useState<ForumThread[]>(SEED_THREADS);
  const [selectedCategory, setSelectedCategory] = useState<ForumThread['category']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'PINNED_LATEST' | 'MOST_UPVOTED' | 'UNANSWERED'>('PINNED_LATEST');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumThread['category']>('COMPASS_AON');
  const [newTag, setNewTag] = useState('COMPASS Prep');

  // New Reply State
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadCommunityThreads();
  }, []);

  const loadCommunityThreads = async () => {
    setLoading(true);
    try {
      const threadsRef = collection(db, 'community_posts');
      const q = query(threadsRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const dbThreads = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ForumThread[];

      // Merge DB threads with Seed threads (DB version overrides seed if edited)
      const mergedMap = new Map<string, ForumThread>();
      SEED_THREADS.forEach((t) => mergedMap.set(t.id, t));
      dbThreads.forEach((t) => mergedMap.set(t.id, t));

      setThreads(Array.from(mergedMap.values()));
    } catch (err) {
      console.warn('Using local/seeded community threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveThreadToFirestore = async (thread: ForumThread) => {
    try {
      await setDoc(doc(db, 'community_posts', thread.id), thread, { merge: true });
    } catch (err) {
      console.warn('Saved locally (Firestore write warning):', err);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const id = `thread_${Date.now()}`;
    const newThread: ForumThread = {
      id,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory === 'ALL' ? 'COMPASS_AON' : newCategory,
      subjectTag: newTag.trim() || 'General',
      authorId: user.id,
      authorName: user.fullName || user.email.split('@')[0],
      authorEmail: user.email,
      authorRole: user.isAdmin
        ? 'Chief Flight Instructor · Admin'
        : `${user.licenceTrack || 'ATPL'} Pilot · ${user.city || 'Cairo'}`,
      authorLocation: `${user.city || 'Cairo'}, ${user.country || 'Egypt'}`,
      isAdmin: Boolean(user.isAdmin),
      createdAt: new Date().toISOString(),
      upvotes: [user.id],
      isPinned: false,
      isSolved: false,
      replies: [],
    };

    setThreads((prev) => [newThread, ...prev]);
    setShowNewModal(false);
    setNewTitle('');
    setNewContent('');
    setActiveThreadId(id);
    await saveThreadToFirestore(newThread);
  };

  const handleToggleUpvote = async (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = threads.find((t) => t.id === threadId);
    if (!target) return;

    const hasVoted = target.upvotes.includes(user.id);
    const updatedUpvotes = hasVoted
      ? target.upvotes.filter((uid) => uid !== user.id)
      : [...target.upvotes, user.id];

    const updatedThread = { ...target, upvotes: updatedUpvotes };
    setThreads((prev) => prev.map((t) => (t.id === threadId ? updatedThread : t)));
    await saveThreadToFirestore(updatedThread);
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId || !replyContent.trim()) return;

    const target = threads.find((t) => t.id === activeThreadId);
    if (!target) return;

    const newReply: ForumReply = {
      id: `reply_${Date.now()}`,
      authorId: user.id,
      authorName: user.fullName || user.email.split('@')[0],
      authorEmail: user.email,
      authorRole: user.isAdmin
        ? 'Chief Flight Instructor · Admin'
        : `${user.licenceTrack || 'ATPL'} Pilot · ${user.city || 'Cairo'}`,
      authorLocation: `${user.city || 'Cairo'}, ${user.country || 'Egypt'}`,
      isAdmin: Boolean(user.isAdmin),
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
      upvotes: [],
      isAcceptedAnswer: false,
    };

    const updatedThread: ForumThread = {
      ...target,
      replies: [...(target.replies || []), newReply],
    };

    setThreads((prev) => prev.map((t) => (t.id === activeThreadId ? updatedThread : t)));
    setReplyContent('');
    await saveThreadToFirestore(updatedThread);
  };

  const handleMarkSolved = async (threadId: string, replyId?: string) => {
    const target = threads.find((t) => t.id === threadId);
    if (!target) return;

    const updatedReplies = (target.replies || []).map((r) =>
      replyId ? { ...r, isAcceptedAnswer: r.id === replyId ? !r.isAcceptedAnswer : r.isAcceptedAnswer } : r
    );
    const updatedThread: ForumThread = {
      ...target,
      isSolved: replyId ? true : !target.isSolved,
      replies: updatedReplies,
    };

    setThreads((prev) => prev.map((t) => (t.id === threadId ? updatedThread : t)));
    await saveThreadToFirestore(updatedThread);
  };

  const handleTogglePin = async (threadId: string) => {
    if (!user.isAdmin) return;
    const target = threads.find((t) => t.id === threadId);
    if (!target) return;
    const updatedThread = { ...target, isPinned: !target.isPinned };
    setThreads((prev) => prev.map((t) => (t.id === threadId ? updatedThread : t)));
    await saveThreadToFirestore(updatedThread);
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!window.confirm('Delete this discussion thread?')) return;
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeThreadId === threadId) setActiveThreadId(null);
    try {
      await deleteDoc(doc(db, 'community_posts', threadId));
    } catch {}
  };

  const filteredThreads = useMemo(() => {
    return threads
      .filter((t) => {
        const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          (t.subjectTag && t.subjectTag.toLowerCase().includes(q)) ||
          t.authorName.toLowerCase().includes(q);
        const matchesUnanswered =
          sortBy !== 'UNANSWERED' || (t.replies?.length || 0) === 0;
        return matchesCat && matchesSearch && matchesUnanswered;
      })
      .sort((a, b) => {
        if (sortBy === 'MOST_UPVOTED') {
          return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
        }
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [threads, selectedCategory, searchQuery, sortBy]);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) || null,
    [threads, activeThreadId]
  );

  const getCategoryMeta = (catId: ForumThread['category']) =>
    CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Crew Lounge Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
                <Users size={14} /> PILOT CREW LOUNGE &amp; STUDY FORUM
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Pilots Helping Pilots — ATPL, COMPASS™ &amp; Airline Prep Forum
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Ask tough EASA ECQB questions, share EgyptAir &amp; airline interview debriefs, discuss 5x5 COMPASS Orientation strategies, and pair up with fellow pilots for simulator checks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={15} /> Hangar
                </button>
              )}
              <button
                onClick={() => setShowNewModal(true)}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Plus size={16} /> Start New Discussion
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5">
              <div className="text-[10px] font-mono uppercase text-slate-400">ACTIVE DISCUSSIONS</div>
              <div className="text-xl font-black text-white mt-0.5">{threads.length}</div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5">
              <div className="text-[10px] font-mono uppercase text-emerald-400">SOLVED BRIEFINGS</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {threads.filter((t) => t.isSolved).length}
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5">
              <div className="text-[10px] font-mono uppercase text-fuchsia-400">COMPASS &amp; AIRLINE THREADS</div>
              <div className="text-xl font-black text-fuchsia-400 mt-0.5">
                {threads.filter((t) => t.category === 'COMPASS_AON' || t.category === 'EGYPTAIR_PREP').length}
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5">
              <div className="text-[10px] font-mono uppercase text-cyan-400">YOUR CALLSIGN</div>
              <div className="text-sm font-bold text-white truncate mt-1">
                {user.fullName || user.email.split('@')[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveThreadId(null);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${
                  active
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/25'
                    : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Thread Detail View OR Thread Feed */}
        {activeThread ? (
          <div className="space-y-6">
            <button
              onClick={() => setActiveThreadId(null)}
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to All Discussions
            </button>

            {/* Main Post Card */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {activeThread.isPinned && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Pin size={12} /> PINNED BRIEFING
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                      getCategoryMeta(activeThread.category).badgeColor
                    }`}
                  >
                    {getCategoryMeta(activeThread.category).label}
                  </span>
                  {activeThread.subjectTag && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center gap-1">
                      <Tag size={11} /> {activeThread.subjectTag}
                    </span>
                  )}
                  {activeThread.isSolved && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> SOLVED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(user.isAdmin || user.id === activeThread.authorId) && (
                    <button
                      onClick={() => handleMarkSolved(activeThread.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                    >
                      {activeThread.isSolved ? 'Mark Unsolved' : '✓ Mark Solved'}
                    </button>
                  )}
                  {user.isAdmin && (
                    <button
                      onClick={() => handleTogglePin(activeThread.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer"
                    >
                      {activeThread.isPinned ? 'Unpin' : 'Pin Thread'}
                    </button>
                  )}
                  {(user.isAdmin || user.id === activeThread.authorId) && (
                    <button
                      onClick={() => handleDeleteThread(activeThread.id)}
                      className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 cursor-pointer"
                      title="Delete Thread"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
                {activeThread.title}
              </h2>

              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-300 text-sm">
                  {activeThread.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{activeThread.authorName}</span>
                    {activeThread.isAdmin && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono">
                        INSTRUCTOR / ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {activeThread.authorRole} · {new Date(activeThread.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {activeThread.content}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={(e) => handleToggleUpvote(activeThread.id, e)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                    activeThread.upvotes.includes(user.id)
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-950 text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp size={15} />
                  <span>Helpful ({activeThread.upvotes.length})</span>
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {activeThread.replies?.length || 0} Pilot Replies
                </span>
              </div>
            </div>

            {/* Replies Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                Crew Responses ({activeThread.replies?.length || 0})
              </h3>

              {(activeThread.replies || []).map((reply) => (
                <div
                  key={reply.id}
                  className={`rounded-2xl p-5 border space-y-3 ${
                    reply.isAcceptedAnswer
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-900 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-cyan-300 text-xs">
                        {reply.authorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{reply.authorName}</span>
                          {reply.isAdmin && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                              INSTRUCTOR
                            </span>
                          )}
                          {reply.isAcceptedAnswer && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 size={11} /> VERIFIED SOLUTION
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {reply.authorRole} · {new Date(reply.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {(user.isAdmin || user.id === activeThread.authorId) && (
                      <button
                        onClick={() => handleMarkSolved(activeThread.id, reply.id)}
                        className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                      >
                        {reply.isAcceptedAnswer ? 'Unmark Solution' : 'Mark as Solution'}
                      </button>
                    )}
                  </div>

                  <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line pl-12">
                    {reply.content}
                  </div>
                </div>
              ))}

              {/* Post Reply Form */}
              <form
                onSubmit={handlePostReply}
                className="bg-slate-900 rounded-2xl border border-white/10 p-5 space-y-4"
              >
                <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Post Your Answer or Debrief Note
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your calculation steps, COMPASS mental shortcut, or study tip..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Send size={14} /> Post Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Thread Feed List */
          <div className="space-y-4">
            {/* Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-white/10">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, COMPASS tips, EgyptAir debriefs, or ATPL subjects..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: 'PINNED_LATEST', label: 'Latest & Pinned' },
                  { id: 'MOST_UPVOTED', label: 'Top Upvoted' },
                  { id: 'UNANSWERED', label: 'Needs Answer' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Threads List */}
            <div className="space-y-3">
              {filteredThreads.map((thread) => {
                const catMeta = getCategoryMeta(thread.category);
                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className="bg-slate-900 hover:bg-slate-800/70 rounded-2xl border border-white/10 p-5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {thread.isPinned && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Pin size={10} /> PINNED
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${catMeta.badgeColor}`}
                        >
                          {catMeta.label}
                        </span>
                        {thread.subjectTag && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {thread.subjectTag}
                          </span>
                        )}
                        {thread.isSolved && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 size={10} /> SOLVED
                          </span>
                        )}
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-white group-hover:text-cyan-400">
                        {thread.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">{thread.content}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                        <span className="text-slate-200 font-bold">{thread.authorName}</span>
                        {thread.isAdmin && (
                          <span className="text-red-400 font-bold">[INSTRUCTOR]</span>
                        )}
                        <span>• {thread.authorLocation || 'Cairo, Egypt'}</span>
                        <span>• {new Date(thread.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                      <button
                        onClick={(e) => handleToggleUpvote(thread.id, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                          thread.upvotes.includes(user.id)
                            ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                            : 'bg-slate-950 text-slate-300 border-white/10'
                        }`}
                      >
                        <ThumbsUp size={13} />
                        <span>{thread.upvotes.length}</span>
                      </button>
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <MessageCircle size={13} className="text-cyan-400" />
                        <span>{thread.replies?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create New Discussion Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 md:p-8 w-full max-w-2xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white">Start a New Pilot Discussion</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Channel Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'ALL').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Subject / Topic Tag
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g., COMPASS Orientation, 061 Gen Nav, EgyptAir Interview"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Question or Briefing Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What do you need help with or want to share with fellow pilots?"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Detailed Question / Scenario *
                </label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Include the question details, values, or airline screening stage so other pilots and instructors can give you a precise answer..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase cursor-pointer"
                >
                  Publish to Pilot Forum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PilotCommunityHub;
