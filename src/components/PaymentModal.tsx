import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Award, 
  Video, 
  Bot, 
  Lock, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  Clock,
  User,
  AlertCircle,
  Crown,
  Film,
  Globe,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProgress, SubscriptionPlan } from '../types';
import { 
  submitProRequest, 
  getCurrentUserRequest, 
  ProAccessRequest 
} from '../utils/proRequests';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pro_99' | 'advanced_299'>('pro_99');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRequest, setUserRequest] = useState<ProAccessRequest | null>(getCurrentUserRequest());
  const [errorMessage, setErrorMessage] = useState('');

  // Check current user request status on open & listen to changes
  useEffect(() => {
    if (!isOpen) return;

    const syncStatus = () => {
      const current = getCurrentUserRequest();
      setUserRequest(current);

      if (current && current.status === 'approved' && !(progress as any).isPremium) {
        // Automatically activate Pro/Advanced
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
        const bonusXp = current.amount === 299 ? 1000 : 500;
        onUpdateProgress({
          ...progress,
          xp: progress.xp + bonusXp,
          isPremium: true,
          subscriptionPlan: current.amount === 299 ? 'advanced_299' : 'pro_99',
        });
      }
    };

    syncStatus();

    const handleUpdate = () => {
      syncStatus();
    };

    window.addEventListener('pro-request-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const interval = setInterval(syncStatus, 1000);

    return () => {
      window.removeEventListener('pro-request-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [isOpen, progress, onUpdateProgress]);

  if (!isOpen) return null;

  const isAlreadyPremium = (progress as any).isPremium === true;
  const isApproved = userRequest?.status === 'approved' || isAlreadyPremium;
  const isPending = userRequest?.status === 'pending' && !isApproved;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name so the executive desk can verify your request.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const amount = selectedPlan === 'advanced_299' ? 299 : 99;

    setTimeout(() => {
      const req = submitProRequest({
        userName: fullName,
        userEmail: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@student.in`,
        upiOrCard: selectedMethod === 'upi' ? (upiId || `${fullName.toLowerCase()}@upi`) : selectedMethod === 'qr' ? 'Scanned QR Code' : 'Credit/Debit Card',
        paymentMethod: selectedMethod,
      });

      // Override amount for 299 if selected
      req.amount = amount;

      setUserRequest(req);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* State 1: ACCESS GRANTED BY CEO ANSH KUMAR */}
        {isApproved ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20 animate-scaleUp">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Access Granted by Executive Desk • Active
              </span>
              <h2 className="text-2xl font-black text-white">
                {progress.subscriptionPlan === 'advanced_299' ? 'Advanced VIP Pass Active 👑' : 'Pro Pass Active ⚡'}
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
                Your request was verified and approved by the Executive Desk. You now have full access to Flow AI Video Studio, Grok AI Think Mode, All Curated Masterclasses, and Verified ProofLoop™ Certificates!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Account Status:</span>
                <span className="font-bold text-emerald-400">Verified & Approved</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current Plan:</span>
                <span className="font-bold text-white">
                  {progress.subscriptionPlan === 'advanced_299' ? '₹299 Advanced VIP Pass' : '₹99 Pro Pass'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Authorized By:</span>
                <span className="font-semibold text-amber-300">Platform Executive Desk</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-opacity"
            >
              Start Exploring Unlimited Features
            </button>
          </div>
        ) : isPending ? (
          /* State 2: PENDING APPROVAL IN CEO DESK */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/20 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                Approval Pending • Executive Review
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Request Sent for Verification!
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 leading-relaxed">
                Your <strong className="text-amber-300">{userRequest?.amount === 299 ? '₹299 Advanced VIP' : '₹99 Pro'} Pass</strong> request has been routed to the executive control desk. As soon as access is granted, this screen will automatically unlock!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs max-w-md mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Student Name:</span>
                <span className="font-bold text-white">{userRequest?.userName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Selected Plan:</span>
                <span className="font-bold text-emerald-400">₹{userRequest?.amount} ({userRequest?.amount === 299 ? 'Advanced VIP' : 'Pro'})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                  Pending Executive Approval
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 text-left">
              <strong>Control Sync Active:</strong> When reviewed in Executive Controls and approved, this screen auto-activates immediately without refreshing.
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close and Continue Free Learning
            </button>
          </div>
        ) : (
          /* State 3: PLAN SELECTION & CHECKOUT FORM */
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Founder Deal • CEO Verified</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Choose Your{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Learning Subscription
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300">
                Divided into two transparent plans: ₹99 Pro vs ₹299 Advanced VIP • Requires Executive Desk Approval
              </p>
            </div>

            {/* TWO PLAN SELECTION TIERS: ₹99 PRO VS ₹299 ADVANCED VIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* ₹99 Pro Pass */}
              <div
                onClick={() => setSelectedPlan('pro_99')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2.5 ${
                  selectedPlan === 'pro_99'
                    ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500 shadow-xl ring-2 ring-indigo-500/50'
                    : 'bg-slate-950/80 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pro Pass</span>
                  </span>
                  <span className="text-xs font-bold text-indigo-400">Standard</span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">₹99</span>
                  <span className="text-xs text-slate-500 line-through">₹499</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded">80% OFF</span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>YouTube Creator Masterclasses</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>Flow AI Standard Clips (10 clips/day)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>ChatGPT GPTs Standard Hub</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>Grok AI Basic Think Mode</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-400">
                    <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>XP limited up to 2,500 XP</span>
                  </li>
                </ul>
              </div>

              {/* ₹299 Advanced VIP Pass */}
              <div
                onClick={() => setSelectedPlan('advanced_299')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2.5 ${
                  selectedPlan === 'advanced_299'
                    ? 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-indigo-950 border-amber-500 shadow-xl ring-2 ring-amber-500/50'
                    : 'bg-slate-950/80 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Advanced VIP</span>
                  </span>
                  <span className="text-[10px] font-black uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full">
                    ALL-IN-ONE
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">₹299</span>
                  <span className="text-xs text-slate-500 line-through">₹1,999</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">BEST VALUE</span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-200">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><strong>Unlimited Flow AI 10s</strong> 4K Video Clips</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><strong>Custom GPT Builder</strong> & Code Execution</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><strong>Gemini 3.8 Pro</strong> with all premium features</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><strong>Grok Unhinged</strong> Deep Reasoning Mode</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><strong>Video Editing & Trending VFX</strong> Masterclasses</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span><strong>Unlimited XP (No Cap)</strong> + Signed Diplomas</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-4 pt-1">
              {errorMessage && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    <span>Hobby-Based Gmail *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. playing@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedMethod === 'upi'
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('qr')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedMethod === 'qr'
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold">Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedMethod === 'card'
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold">Card / NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Payment Details Input */}
              {selectedMethod === 'upi' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Enter UPI ID:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 font-mono"
                  />
                </div>
              )}

              {selectedMethod === 'qr' && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1 text-xs">
                  <div className="w-20 h-20 bg-white rounded-lg mx-auto flex items-center justify-center text-slate-900 font-bold">
                    [QR CODE]
                  </div>
                  <p className="text-[11px] text-slate-400">Scan using PhonePe, Google Pay, or Paytm</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Routing request to Executive Desk...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Pay {selectedPlan === 'advanced_299' ? '₹299 (Advanced VIP)' : '₹99 (Pro)'} & Request Executive Approval
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Executive Desk verification active • 100% Secure Transaction</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
