
import React, { useState } from 'react';
import { User, View } from '../types';
import { User as UserIcon, Mail, Clock, Shield, LogOut, Lock, CheckCircle, Settings } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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

            {/* Demo Activation Section */}
            {(!user.subscriptionTier || user.subscriptionTier === 'CUSTOM') && !user.demoStartDate && !user.isAdmin && (
                <div className="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="p-1 bg-indigo-500/20 rounded shadow shadow-indigo-500/10">🚀</span>
                            Unlock 3-Hour Demo
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 max-w-lg">
                            Get unrestricted access to the entire platform for 3 hours.
                            Explore simulators, question banks, and AI tools. One-time use only.
                        </p>
                        <button
                            onClick={async () => {
                                if (confirm("Activate 3-hour demo now? The timer starts immediately.")) {
                                    try {
                                        setLoading(true);
                                        const now = new Date().toISOString();
                                        await updateDoc(doc(db, 'profiles', user.id), { demo_start_date: now });

                                        // Force refresh - simplistic but effective for now
                                        window.location.reload();
                                    } catch (err) {
                                        alert("Failed to activate demo. Please try again.");
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                            disabled={loading}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                        >
                            {loading ? "Activating..." : "Activate Now"}
                        </button>
                    </div>
                </div>
            )}

            {/* Active Demo Timer */}
            {user.demoStartDate && (
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock className="text-indigo-400" size={20} />
                                Demo Active
                            </h3>
                            <p className="text-slate-400 text-xs mt-1">
                                Started: {new Date(user.demoStartDate).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-indigo-300">
                                {/* Ideally calculate remaining time here dynamically, but static for profile view is fine for first pass */}
                                Ends: {new Date(new Date(user.demoStartDate).getTime() + 3 * 60 * 60 * 1000).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={onLogout}
                className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold rounded-xl border border-red-900/50 transition flex items-center justify-center"
            >
                <LogOut className="w-5 h-5 mr-2" /> Sign Out
            </button>

            {/* Testimonial Submission */}
            <AddTestimonial user={user} />
        </div>
    );
};

// Internal Component for Testimonial Submission
import { Star, Send } from 'lucide-react';
import { TestimonialService } from '../services/TestimonialService';

const AddTestimonial = ({ user }: { user: User }) => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        try {
            await TestimonialService.submitTestimonial(
                user.id,
                user.fullName || 'Pilot',
                'ATPL Student', // Default role
                text,
                rating
            );
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="mt-8 bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center animate-in fade-in">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                <p className="text-slate-400">Your review has been submitted and is pending approval.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-2" /> Write a Review
            </h3>
            <p className="text-sm text-slate-400 mb-6">
                Enjoying the platform? Leave a testimonial to help other pilots discover ATPLVector.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRating(r)}
                                className={`p-2 rounded-lg transition-all ${rating >= r ? 'text-yellow-400 scale-110' : 'text-slate-600 hover:text-slate-500'}`}
                            >
                                <Star fill={rating >= r ? "currentColor" : "none"} size={24} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Experience</label>
                    <textarea
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition-all"
                        placeholder="What do you like most about the platform?"
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center disabled:opacity-50"
                >
                    {loading ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Submit Review</>}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
