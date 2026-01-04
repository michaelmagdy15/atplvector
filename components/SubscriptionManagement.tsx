
import React, { useState } from 'react';
import { User } from '../types';
import { SUBJECTS } from '../data/learningObjectives';
import { Check, CreditCard, Shield, Zap, ArrowLeft, CheckCircle, Layout, History, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
    onBack: () => void;
}

const SubscriptionManagement: React.FC<Props> = ({ user, onUpdateUser, onBack }) => {
    const [plan, setPlan] = useState<'CUSTOM' | 'PRO_MONTHLY' | 'PRO_YEARLY'>(user.subscriptionTier || 'CUSTOM');
    const initialSubjects = (user.allowedSubjects || []).filter(s => s !== 'ALL');
    const [subjects, setSubjects] = useState<string[]>(initialSubjects);
    
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const toggleSubject = (id: string) => {
        if (subjects.includes(id)) {
            setSubjects(subjects.filter(s => s !== id));
        } else {
            setSubjects([...subjects, id]);
        }
    };

    const getPrice = () => {
        if (plan === 'PRO_MONTHLY') return 29;
        if (plan === 'PRO_YEARLY') return 290;
        return subjects.length * 19;
    };

    const getBillingPeriod = () => {
        if (plan === 'PRO_YEARLY') return '/ year';
        return '/ month';
    };

    // MANUAL SUBSCRIPTION LOGIC (Option B)
    const handleSave = async () => {
        if (plan === 'CUSTOM' && subjects.length === 0) {
            alert("Please select at least one subject for the Custom plan.");
            return;
        }

        setLoading(true);
        const newAllowed = plan === 'CUSTOM' ? subjects : ['ALL'];
        
        try {
            // 1. Check if subscription exists (Avoids ON CONFLICT error if DB constraint is missing)
            const { data: existingSub } = await supabase
                .from('subscriptions')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            const subPayload = {
                user_id: user.id,
                status: 'active',
                plan: plan,
                updated_at: new Date().toISOString()
            };

            let error;

            if (existingSub) {
                // Update existing
                const res = await supabase
                    .from('subscriptions')
                    .update(subPayload)
                    .eq('id', existingSub.id);
                error = res.error;
            } else {
                // Insert new
                const res = await supabase
                    .from('subscriptions')
                    .insert(subPayload);
                error = res.error;
            }

            if (error) throw error;

            // Update local state
            const updatedUser: User = {
                ...user,
                subscriptionTier: plan,
                allowedSubjects: newAllowed
            };
            onUpdateUser(updatedUser);
            
            setSuccessMsg("Subscription updated successfully!");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: any) {
            console.error('Subscription error:', error);
            alert("Failed to update subscription. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-8">
            <button 
                onClick={onBack}
                className="flex items-center text-slate-400 hover:text-white mb-6 font-bold text-sm transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                <CreditCard className="text-blue-500" /> Subscription Management
            </h1>
            <p className="text-slate-400 mb-8">Manage your plan, add or remove modules, and view billing details.</p>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Column: Plan Selection */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Plan Cards */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Select Plan</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div 
                                onClick={() => setPlan('CUSTOM')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                    plan === 'CUSTOM' 
                                    ? 'border-blue-500 bg-blue-900/20' 
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Layout className={`w-6 h-6 ${plan === 'CUSTOM' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    {plan === 'CUSTOM' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                                </div>
                                <h3 className="font-bold text-white">Custom</h3>
                                <p className="text-xs text-slate-400 mt-1">Pay per subject ($19/mo)</p>
                            </div>

                            <div 
                                onClick={() => setPlan('PRO_MONTHLY')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                    plan === 'PRO_MONTHLY' 
                                    ? 'border-emerald-500 bg-emerald-900/20' 
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Zap className={`w-6 h-6 ${plan === 'PRO_MONTHLY' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                    {plan === 'PRO_MONTHLY' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                </div>
                                <h3 className="font-bold text-white">Pro Monthly</h3>
                                <p className="text-xs text-slate-400 mt-1">All Access ($29/mo)</p>
                            </div>

                            <div 
                                onClick={() => setPlan('PRO_YEARLY')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                    plan === 'PRO_YEARLY' 
                                    ? 'border-purple-500 bg-purple-900/20' 
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Shield className={`w-6 h-6 ${plan === 'PRO_YEARLY' ? 'text-purple-400' : 'text-slate-500'}`} />
                                    {plan === 'PRO_YEARLY' && <CheckCircle className="w-5 h-5 text-purple-500" />}
                                </div>
                                <h3 className="font-bold text-white">Pro Yearly</h3>
                                <p className="text-xs text-slate-400 mt-1">Best Value ($290/yr)</p>
                            </div>
                        </div>
                    </div>

                    {/* Subject Selector (Only for Custom) */}
                    {plan === 'CUSTOM' && (
                        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-in fade-in slide-in-from-top-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Select Subjects</h2>
                                <span className="text-sm font-bold text-slate-400">Selected: {subjects.length}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600">
                                {SUBJECTS.map(sub => {
                                    const isSelected = subjects.includes(sub.id);
                                    return (
                                        <div 
                                            key={sub.id}
                                            onClick={() => toggleSubject(sub.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                                isSelected 
                                                ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                            }`}
                                        >
                                            <span className="text-sm font-bold truncate pr-2">{sub.id} {sub.name.split(':')[0]}</span>
                                            {isSelected && <Check size={16} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Pro Benefits Info */}
                    {(plan === 'PRO_MONTHLY' || plan === 'PRO_YEARLY') && (
                        <div className="bg-emerald-900/10 rounded-xl border border-emerald-500/30 p-6 animate-in fade-in">
                            <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                <Zap size={18} /> Pro Access Unlocked
                            </h3>
                            <p className="text-slate-300 text-sm">
                                You have full access to all 14 ATPL subjects, advanced simulators (VFR/IFR Comms, Holding, Met), AI Roleplay, and priority support.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: Summary & Billing */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-4">Order Summary</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Plan Type</span>
                                <span className="text-white font-bold">
                                    {plan === 'CUSTOM' ? 'Custom Selection' : (plan === 'PRO_MONTHLY' ? 'Monthly Pro' : 'Yearly Pro')}
                                </span>
                            </div>
                            {plan === 'CUSTOM' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subjects</span>
                                    <span className="text-white font-bold">{subjects.length} x $19</span>
                                </div>
                            )}
                            <div className="border-t border-slate-700 pt-4 flex justify-between items-end">
                                <span className="text-slate-300 font-bold">Total</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-white">${getPrice()}</span>
                                    <span className="text-slate-500 text-xs font-bold">{getBillingPeriod()}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                                loading ? 'bg-slate-700 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? 'Processing...' : <><Save size={18} /> Update Subscription</>}
                        </button>

                        {successMsg && (
                            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">
                                {successMsg}
                            </div>
                        )}
                    </div>

                    {/* Billing Info Mockup */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <History size={18} className="text-slate-400" /> Billing Status
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status</span>
                                <span className="text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded text-xs">ACTIVE</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Next Billing Date</span>
                                <span className="text-white font-mono">{nextBillingDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Payment Method</span>
                                <span className="text-white flex items-center gap-1"><CreditCard size={12}/> •••• 4242</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubscriptionManagement;
