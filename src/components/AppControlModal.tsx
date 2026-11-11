import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  RotateCcw, 
  Unlock, 
  Zap, 
  Flame, 
  Server, 
  Languages, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Globe2,
  Sliders
} from 'lucide-react';
import { LanguageTone, UserProgress } from '../types';
import { CURATED_SKILLS } from '../data/curatedSkills';
import { CURATED_EXERCISES } from '../data/curatedExercises';
import { Lock, Share2, Bell, CheckCircle, XCircle, UserCheck, Award, Clock, Calendar, Eye, EyeOff, Search, Users, KeyRound } from 'lucide-react';
import { 
  getProRequests, 
  approveProRequest, 
  rejectProRequest, 
  approveAllPendingRequests,
  submitProRequest,
  ProAccessRequest,
  ProDuration,
  getProDurationLabel,
  calculateExpiry
} from '../utils/proRequests';
import { 
  getRegisteredUsers, 
  saveRegisteredUsers, 
  StoredUserProfile 
} from '../utils/userProfiles';
import { CeoGeminiStudio } from './CeoGeminiStudio';
import { LiveCodeApplierSection } from './LiveCodeApplierSection';
import { Cpu, Code } from 'lucide-react';

interface AppControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  languageTone: LanguageTone;
  setLanguageTone: (tone: LanguageTone) => void;
  onOpenSafeShare?: () => void;
  initialTab?: 'gemini' | 'code_injector' | 'users' | 'requests' | 'system' | 'curriculum';
}

export const AppControlModal: React.FC<AppControlModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  languageTone,
  setLanguageTone,
  onOpenSafeShare,
  initialTab = 'gemini',
}) => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'code_injector' | 'users' | 'requests' | 'system' | 'curriculum'>(initialTab);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState('asia-east');
  const [confettiEnabled, setConfettiEnabled] = useState(true);
  const [requests, setRequests] = useState<ProAccessRequest[]>(getProRequests());
  const [selectedDuration, setSelectedDuration] = useState<ProDuration>('1year');
  const [registeredUsers, setRegisteredUsers] = useState<StoredUserProfile[]>(getRegisteredUsers());
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [userSearchQuery, setUserSearchQuery] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Listen to live Pro requests and user profiles
  React.useEffect(() => {
    const sync = () => {
      setRequests(getProRequests());
      setRegisteredUsers(getRegisteredUsers());
    };
    window.addEventListener('pro-request-updated', sync);
    window.addEventListener('user-profiles-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('pro-request-updated', sync);
      window.removeEventListener('user-profiles-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!isOpen) return null;

  const devUrl = 'https://ais-dev-ynjgiuxez2dfchcgrbcxu4-994597833907.asia-east1.run.app';
  const sharedUrl = 'https://ais-pre-ynjgiuxez2dfchcgrbcxu4-994597833907.asia-east1.run.app';

  const copyLink = (type: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleApprove = (reqId: string, customDuration?: ProDuration) => {
    const dur = customDuration || selectedDuration;
    const expiry = approveProRequest(reqId, dur);
    setRequests(getProRequests());
    // Also if it belongs to current session, activate with duration & expiry
    const target = requests.find(r => r.id === reqId);
    if (target?.isCurrentUser) {
      onUpdateProgress({
        ...progress,
        isPremium: true,
        proDuration: expiry.duration,
        proExpiresAt: expiry.expiresAt,
        proExpiresAtFormatted: expiry.expiresAtFormatted,
      });
    }
  };

  const handleReject = (reqId: string) => {
    rejectProRequest(reqId);
    setRequests(getProRequests());
  };

  const handleApproveAll = () => {
    const expiry = approveAllPendingRequests(selectedDuration);
    setRequests(getProRequests());
    onUpdateProgress({
      ...progress,
      isPremium: true,
      proDuration: expiry.duration,
      proExpiresAt: expiry.expiresAt,
      proExpiresAtFormatted: expiry.expiresAtFormatted,
    });
  };

  const handleAddTestRequest = () => {
    const names = ['Kunal Kushwaha', 'Tanay Pratap', 'Sanket Singh', 'Shubham Sharma', 'Ananya Roy'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    submitProRequest({
      userName: randomName,
      userEmail: `${randomName.toLowerCase().replace(/\s+/g, '')}@student.org`,
      upiOrCard: `${randomName.toLowerCase().split(' ')[0]}@okaxis`,
      paymentMethod: 'upi',
    });
    setRequests(getProRequests());
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const handleUnlockAll = () => {
    const allSkillIds = CURATED_SKILLS.map((s) => s.id);
    const allExIds = CURATED_EXERCISES.map((e) => e.id);
    onUpdateProgress({
      ...progress,
      masteredSkills: allSkillIds,
      completedExercises: allExIds,
      xp: progress.xp + 500,
    });
  };

  const handleResetProgress = () => {
    onUpdateProgress({
      xp: 100,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedExercises: [],
      masteredSkills: [],
      bookmarkedQuestions: [],
      quizScores: {},
    });
  };

  const handleAddXP = (amount: number) => {
    onUpdateProgress({
      ...progress,
      xp: progress.xp + amount,
    });
  };

  const handleIncrementStreak = () => {
    onUpdateProgress({
      ...progress,
      streak: progress.streak + 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">App Control Center</h2>
              <p className="text-xs text-slate-400">
                Full administrative control over your learning state, curriculum, servers, and URLs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Founder & CEO Leadership Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-indigo-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-300 text-sm">
                AK
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Ansh Kumar</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Founder & CEO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Founder of SkillGraph • Creator of the ProofLoop™ Learning Methodology
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Executive Access
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('gemini')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gemini'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                : 'text-amber-300/80 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>⚡ Gemini 3.8 Flash Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code_injector')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'code_injector'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-black'
                : 'text-cyan-300/80 hover:text-cyan-300 hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4 text-cyan-400" />
            <span>💻 Live Code Injector & Customizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Passwords & Vault</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Pro Approvals</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'system'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Safe Links & Server</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>XP & Gamification</span>
          </button>
        </div>

        {/* TAB 1: PERMANENT GEMINI 3.8 FLASH ARCHITECTURE STUDIO */}
        {activeTab === 'gemini' && (
          <CeoGeminiStudio />
        )}

        {/* TAB 2: LIVE CODE INJECTOR & DYNAMIC CUSTOMIZER */}
        {activeTab === 'code_injector' && (
          <LiveCodeApplierSection />
        )}

        {/* TAB 4: SYSTEM DISTRIBUTION & SERVER URLS */}
        {activeTab === 'system' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>Safe Link Distribution (For Users & Students)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Tamper-Proof
            </span>
          </div>

          {/* Highlighted Safe User Link for Public Sharing */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Public Safe URL (Send this to anyone)</span>
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Visitors on this link <span className="text-white font-semibold">CANNOT tamper</span> with your app or access CEO controls.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <span className="text-[11px] font-mono text-emerald-400 truncate max-w-sm bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                {sharedUrl}
              </span>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => copyLink('safe-user', sharedUrl)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                >
                  {copiedUrl === 'safe-user' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl === 'safe-user' ? 'Copied Safe Link!' : 'Copy Safe Link'}</span>
                </button>
                {onOpenSafeShare && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSafeShare();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share Hub</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
              <div>
                <span className="font-bold text-white block">CEO Development URL:</span>
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-sm block">
                  {devUrl}
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => copyLink('dev', devUrl)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedUrl === 'dev' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === 'dev' ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={devUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Edge Routing Cluster inside System tab */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Backend Edge Routing Cluster
          </h3>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Active Fast Accelerator</div>
                <div className="text-[11px] text-slate-500">
                  Global multi-region server cluster for instant Q&A and code diagnosis
                </div>
              </div>
            </div>

            <select
              aria-label="Accelerator Region"
              value={activeServer}
              onChange={(e) => setActiveServer(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none"
            >
              <option value="asia-east">Tokyo/Mumbai (18ms)</option>
              <option value="us-central">Iowa US-Central (32ms)</option>
              <option value="europe-west">Frankfurt EU (25ms)</option>
            </select>
          </div>
        </div>
      </div>
      )}

        {/* TAB 3: EXECUTIVE PRO PASS APPROVALS */}
        {activeTab === 'requests' && (
          <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/40 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/40 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Executive Pro Pass Approvals</span>
                </h3>
                {pendingCount > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{pendingCount} Pending Approval</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    All Clear ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Users cannot access Pro Mode without CEO Ansh Kumar's explicit permission.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <button
                  onClick={handleApproveAll}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Grant All ({pendingCount})</span>
                </button>
              )}
              <button
                onClick={handleAddTestRequest}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
                title="Simulate a new incoming student payment request"
              >
                <span>+ Test Request</span>
              </button>
            </div>
          </div>

          {/* Pro Access Duration Selector (1 Month, 3 Months, 1 Year, Lifetime) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Set Pro Access Duration (CEO Authority):</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {(['1month', '3month', '1year', 'lifetime'] as ProDuration[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDuration(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDuration === d
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d === '1month' ? '1 Month (30d)' : d === '3month' ? '3 Months (90d)' : d === '1year' ? '1 Year (365d)' : 'Lifetime ∞'}
                </button>
              ))}
            </div>
          </div>

          {/* List of Requests */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {requests.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No payment requests yet. When a student clicks ₹99, their request appears here.
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    req.status === 'pending'
                      ? 'bg-slate-900 border-amber-500/40 shadow-sm'
                      : req.status === 'approved'
                      ? 'bg-slate-900/60 border-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white">{req.userName}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        ₹{req.amount}
                      </span>
                      {req.isCurrentUser && (
                        <span className="text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                          Current Browser
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>{req.userEmail}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-mono text-[10px]">{req.upiOrCard}</span>
                      <span>•</span>
                      <span className="text-slate-500 text-[10px]">{req.timestamp}</span>
                      {req.expiresAtFormatted && (
                        <span className="text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 text-[10px]">
                          📅 {getProDurationLabel(req.duration)} (Expires: {req.expiresAtFormatted})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Grant Pro ({selectedDuration})</span>
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : req.status === 'approved' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Access Granted</span>
                        </span>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="text-[10px] text-slate-500 hover:text-red-400 underline"
                          title="Revoke Pro Access"
                        >
                          Revoke
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-xl">
                        Denied
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* TAB 2: REGISTERED USERS & PASSWORDS VAULT */}
        {activeTab === 'users' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>Registered Users & Passwords Vault</span>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                    {registeredUsers.length} Students
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  View student profiles, necessary names, and their security passwords.
                </p>
              </div>
            </div>

            {/* User Search Input */}
            <div className="relative">
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search user name..."
                className="pl-7 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Student Records List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {registeredUsers
              .filter(u => !userSearchQuery || u.name.toLowerCase().includes(userSearchQuery.toLowerCase()))
              .map((u) => {
                const isPasswordRevealed = showPasswords[u.id] ?? true; // Visible by default for CEO
                return (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">{u.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {u.id}
                        </span>
                        {u.isPro ? (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            PRO PASS ({u.proDuration || 'Active'})
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                            Free Tier
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-[11px] flex-wrap">
                        <span>{u.email || 'student@skillgraph.in'}</span>
                        <span>•</span>
                        <span className="text-slate-300 truncate max-w-xs">{u.goal}</span>
                      </div>

                      {/* Password Row (CEO Inspection) */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-amber-400" />
                          <span>Password:</span>
                        </span>
                        <span className="font-mono text-xs text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {isPasswordRevealed ? u.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, [u.id]: !isPasswordRevealed }))}
                          className="text-slate-400 hover:text-white transition-colors"
                          title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                        >
                          {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick Grant Pro from Vault */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const expiry = calculateExpiry(selectedDuration);
                          const updated = registeredUsers.map(usr => usr.id === u.id ? {
                            ...usr,
                            isPro: true,
                            proDuration: getProDurationLabel(selectedDuration),
                            proExpiresAtFormatted: expiry.expiresAtFormatted
                          } : usr);
                          saveRegisteredUsers(updated);
                          setRegisteredUsers(updated);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                      >
                        Grant Pro ({selectedDuration})
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        )}

        {/* TAB 5: CURRICULUM & GAMIFICATION */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Curriculum & Progress Overrides */}
            <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Curriculum & Gamification Overrides
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* XP Controls */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>XP Level</span>
                </span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">
                  {progress.xp} XP
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddXP(50)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-800"
                >
                  +50 XP
                </button>
                <button
                  onClick={() => handleAddXP(200)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-800"
                >
                  +200 XP
                </button>
              </div>
            </div>

            {/* Streak Controls */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Daily Streak</span>
                </span>
                <span className="font-mono font-extrabold text-amber-400 text-sm">
                  {progress.streak} Days
                </span>
              </div>
              <button
                onClick={handleIncrementStreak}
                className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-800"
              >
                +1 Day Streak
              </button>
            </div>
          </div>

          {/* Quick Actions: Unlock All, Grant Pro Pass & Reset */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleUnlockAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock All Curricula & Exercises (+500 XP)</span>
            </button>

            <button
              onClick={() => {
                onUpdateProgress({
                  ...progress,
                  isPremium: !(progress as any).isPremium,
                } as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                (progress as any).isPremium
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{(progress as any).isPremium ? 'Revoke VIP Pro Pass' : 'Grant VIP Pro Pass (Free)'}</span>
            </button>

            <button
              onClick={handleResetProgress}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Language & Tone Style Control */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Explanation Persona & Language Style
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'simple-english', label: 'English', desc: 'Simple & Real-Life' },
              { id: 'hinglish', label: 'Hinglish', desc: 'Hindi-English Blend' },
              { id: 'eli5', label: 'ELI5', desc: 'Like I\'m 5 Years Old' },
              { id: 'technical', label: 'Technical', desc: 'In-Depth Engineering' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setLanguageTone(t.id as LanguageTone)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  languageTone === t.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-[10px] opacity-75">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
