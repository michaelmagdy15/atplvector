
import React, { useState } from 'react';
import { User } from '../types';
import { SUBJECTS } from '../data/learningObjectives';
import { Check, CreditCard, Shield, Zap, ArrowLeft, CheckCircle, Layout, History, Save } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

interface Props {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
    onBack: () => void;
}

const SubscriptionManagement: React.FC<Props> = ({ user, onUpdateUser, onBack }) => {
    const validPlans = ['1_MONTH', '3_MONTHS', '6_MONTHS', '9_MONTHS', '12_MONTHS', 'SINGLE_SUBJECT'];
    const initialPlan = validPlans.includes(user.subscriptionTier as any) ? user.subscriptionTier : '1_MONTH';
    const [plan, setPlan] = useState<'1_MONTH' | '3_MONTHS' | '6_MONTHS' | '9_MONTHS' | '12_MONTHS' | 'SINGLE_SUBJECT'>(initialPlan as any);
    const initialSubjects = (user.allowedSubjects || []).filter(s => s !== 'ALL');
    const [subjects, setSubjects] = useState<string[]>(initialSubjects);
    const [licenseKey, setLicenseKey] = useState('');

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
        if (plan === '12_MONTHS') return 95;
        if (plan === '9_MONTHS') return 80;
        if (plan === '6_MONTHS') return 60;
        if (plan === '3_MONTHS') return 35;
        if (plan === '1_MONTH') return 15;
        if (plan === 'SINGLE_SUBJECT') return subjects.length * 10;
        return 0;
    };

    const getBillingPeriod = () => {
        if (plan === '12_MONTHS') return '/ 12 months';
        if (plan === '9_MONTHS') return '/ 9 months';
        if (plan === '6_MONTHS') return '/ 6 months';
        if (plan === '3_MONTHS') return '/ 3 months';
        if (plan === '1_MONTH') return '/ month';
        if (plan === 'SINGLE_SUBJECT') return '/ 3 months';
        return '';
    };

    // MANUAL SUBSCRIPTION LOGIC (Firebase Version) -> UPDATED TO GUMROAD VERIFICATION
    const handleVerifyLicense = async () => {
        if (plan === 'SINGLE_SUBJECT' && subjects.length === 0) {
            alert("Please select at least one subject for the Single Subject plan.");
            return;
        }

        if (!licenseKey.trim()) {
            alert("Please enter your Gumroad License Key.");
            return;
        }

        setLoading(true);

        try {
            // --- GUMROAD API VERIFICATION ---
            const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    product_id: '0q6hZSyKhdLOZmsWr3hXug==',
                    license_key: licenseKey.trim(),
                    increment_uses_count: 'false' // set to 'true' if you want Gumroad to count activations
                })
            });

            const data = await response.json();
            console.log("Gumroad Verify Response:", data);

            if (!data.success || !data.purchase) {
                alert(`Invalid license key: ${data.message || 'Verification failed.'}`);
                setLoading(false);
                return;
            }

            // Try to deduce actual plan from Gumroad purchase data to prevent saving incorrect plan from UI state
            let actualPlan = plan;
            if (data.purchase) {
                const priceCents = data.purchase.price;
                if (priceCents === 9500 || priceCents === 11900) actualPlan = '12_MONTHS';
                else if (priceCents === 8000 || priceCents === 9900) actualPlan = '9_MONTHS';
                else if (priceCents === 6000 || priceCents === 7900) actualPlan = '6_MONTHS';
                else if (priceCents === 3500 || priceCents === 4900) actualPlan = '3_MONTHS';
                else if (priceCents === 1500 || priceCents === 1900 || priceCents === 2500) actualPlan = '1_MONTH';

                // Fallback to variant checking if price doesn't match perfectly
                const variantsStr = JSON.stringify(data.purchase.variants || '').toLowerCase();
                if (variantsStr.includes('1 month')) actualPlan = '1_MONTH';
                else if (variantsStr.includes('3 month')) actualPlan = '3_MONTHS';
                else if (variantsStr.includes('6 month')) actualPlan = '6_MONTHS';
                else if (variantsStr.includes('9 month')) actualPlan = '9_MONTHS';
                else if (variantsStr.includes('12 month') || variantsStr.includes('1 year')) actualPlan = '12_MONTHS';
            }

            // Calculate expires_at
            const expiresAt = new Date();
            if (actualPlan === '12_MONTHS') expiresAt.setMonth(expiresAt.getMonth() + 12);
            else if (actualPlan === '9_MONTHS') expiresAt.setMonth(expiresAt.getMonth() + 9);
            else if (actualPlan === '6_MONTHS') expiresAt.setMonth(expiresAt.getMonth() + 6);
            else if (actualPlan === '3_MONTHS' || actualPlan === 'SINGLE_SUBJECT') expiresAt.setMonth(expiresAt.getMonth() + 3);
            else if (actualPlan === '1_MONTH') expiresAt.setMonth(expiresAt.getMonth() + 1);

            // --- FIREBASE UPDATE ---
            const newAllowed = actualPlan === 'SINGLE_SUBJECT' ? subjects : ['ALL'];

            const subsRef = collection(db, 'subscriptions');
            const q = query(subsRef, where('user_id', '==', user.id));
            const querySnapshot = await getDocs(q);

            const subPayload: any = {
                user_id: user.id,
                status: 'active',
                plan: actualPlan,
                gumroad_license_key: licenseKey.trim(),
                updated_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString()
            };

            if (actualPlan === 'SINGLE_SUBJECT') {
                subPayload.allowed_subjects = subjects;
            }

            if (!querySnapshot.empty) {
                // Update existing subscription
                const subDoc = querySnapshot.docs[0];
                const subDocRef = doc(db, 'subscriptions', subDoc.id);
                await updateDoc(subDocRef, subPayload);
            } else {
                // Create new subscription using setDoc with auto-generated ID or user-based ID
                const subDocRef = doc(db, 'subscriptions', user.id);
                await setDoc(subDocRef, subPayload, { merge: true });
            }

            // Update local state
            const updatedUser: User = {
                ...user,
                subscriptionTier: actualPlan,
                allowedSubjects: newAllowed
            };
            onUpdateUser(updatedUser);
            setPlan(actualPlan as any);

            setSuccessMsg("Subscription activated successfully!");
            setLicenseKey(''); // Clear the key after success
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: any) {
            console.error('Subscription error:', error);
            alert("Failed to verify subscription. " + error.message);
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
            <p className="text-slate-400 mb-8">Select your plan duration. All plans include every subject and simulator.</p>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Plan Selection */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Plan Cards */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Select Plan Duration</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {/* 12 Months */}
                            <div
                                onClick={() => setPlan('12_MONTHS')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${plan === '12_MONTHS'
                                    ? 'border-emerald-500 bg-emerald-900/20'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Shield className={`w-5 h-5 ${plan === '12_MONTHS' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                    {plan === '12_MONTHS' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                </div>
                                <h3 className="font-bold text-white text-sm">12 Months</h3>
                                <p className="text-emerald-400 text-xs font-bold">€119</p>
                                <p className="text-[10px] text-slate-500 mt-1">Best Value</p>
                            </div>

                            {/* 9 Months */}
                            <div
                                onClick={() => setPlan('9_MONTHS')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${plan === '9_MONTHS'
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Zap className={`w-5 h-5 ${plan === '9_MONTHS' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    {plan === '9_MONTHS' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                </div>
                                <h3 className="font-bold text-white text-sm">9 Months</h3>
                                <p className="text-blue-400 text-xs font-bold">€99</p>
                            </div>

                            {/* 6 Months */}
                            <div
                                onClick={() => setPlan('6_MONTHS')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${plan === '6_MONTHS'
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Zap className={`w-5 h-5 ${plan === '6_MONTHS' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    {plan === '6_MONTHS' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                </div>
                                <h3 className="font-bold text-white text-sm">6 Months</h3>
                                <p className="text-blue-400 text-xs font-bold">€79</p>
                            </div>

                            {/* 3 Months */}
                            <div
                                onClick={() => setPlan('3_MONTHS')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${plan === '3_MONTHS'
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Zap className={`w-5 h-5 ${plan === '3_MONTHS' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    {plan === '3_MONTHS' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                </div>
                                <h3 className="font-bold text-white text-sm">3 Months</h3>
                                <p className="text-blue-400 text-xs font-bold">€49</p>
                            </div>

                            {/* 1 Month */}
                            <div
                                onClick={() => setPlan('1_MONTH')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${plan === '1_MONTH'
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Zap className={`w-5 h-5 ${plan === '1_MONTH' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    {plan === '1_MONTH' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                </div>
                                <h3 className="font-bold text-white text-sm">1 Month</h3>
                                <p className="text-blue-400 text-xs font-bold">€19</p>
                            </div>

                            {/* Single Subject */}
                            <div
                                onClick={() => setPlan('SINGLE_SUBJECT')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${plan === 'SINGLE_SUBJECT'
                                    ? 'border-purple-500 bg-purple-900/20'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Layout className={`w-5 h-5 ${plan === 'SINGLE_SUBJECT' ? 'text-purple-400' : 'text-slate-500'}`} />
                                    {plan === 'SINGLE_SUBJECT' && <CheckCircle className="w-4 h-4 text-purple-500" />}
                                </div>
                                <h3 className="font-bold text-white text-sm">1 Subject</h3>
                                <p className="text-purple-400 text-xs font-bold">€25 each</p>
                            </div>
                        </div>
                    </div>

                    {/* Subject Selector (Only for Single Subject) */}
                    {plan === 'SINGLE_SUBJECT' && (
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
                                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${isSelected
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

                    {/* Full Access Benefits Info */}
                    {plan !== 'SINGLE_SUBJECT' && (
                        <div className="bg-emerald-900/10 rounded-xl border border-emerald-500/30 p-6 animate-in fade-in">
                            <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                <Zap size={18} /> Full Access Unlocked
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
                                    {plan === 'SINGLE_SUBJECT' ? 'Single Subject' : plan.replace('_', ' ')}
                                </span>
                            </div>
                            {plan === 'SINGLE_SUBJECT' && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Subjects</span>
                                        <span className="text-white font-bold">{subjects.length} x €25</span>
                                    </div>
                                    {subjects.length > 0 && (
                                        <div className="flex flex-col gap-1 pl-2 mb-2">
                                            {subjects.map(subId => {
                                                const subInfo = SUBJECTS.find(s => s.id === subId);
                                                if (!subInfo) return null;
                                                return (
                                                    <div key={subId} className="text-xs text-slate-400 flex items-center gap-2">
                                                        <Check size={10} className="text-blue-500" />
                                                        <span>{subInfo.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="border-t border-slate-700 pt-4 flex justify-between items-end">
                                <span className="text-slate-300 font-bold">Total</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-white">€{getPrice()}</span>
                                    <span className="text-slate-500 text-xs font-bold">{getBillingPeriod()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Gumroad Instructions */}
                        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-sm">
                                <CreditCard size={16} /> How to Subscribe
                            </h3>
                            <p className="text-slate-300 text-xs mb-3">
                                1. Purchase your selected plan on our Gumroad store.<br />
                                2. You will receive a unique <strong>License Key</strong> in your email.<br />
                                3. Paste the key below to activate your account.
                            </p>
                            <a 
                                href="https://2567628920178.gumroad.com/l/mitivr?wanted=true" 
                                target="_blank" 
                                rel="noreferrer"
                                className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-center rounded-lg text-sm font-bold border border-slate-600 transition-colors"
                            >
                                Open Gumroad Store
                            </a>
                        </div>

                        {/* License Key Input */}
                        <div className="mb-6">
                            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">
                                License Key
                            </label>
                            <input 
                                type="text"
                                value={licenseKey}
                                onChange={(e) => setLicenseKey(e.target.value)}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            />
                        </div>

                        <button
                            onClick={handleVerifyLicense}
                            disabled={loading || !licenseKey.trim()}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${(loading || !licenseKey.trim()) ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? 'Verifying...' : <><CheckCircle size={18} /> Verify License & Activate</>}
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
                                <span className="text-white flex items-center gap-1"><CreditCard size={12} /> •••• 4242</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubscriptionManagement;
