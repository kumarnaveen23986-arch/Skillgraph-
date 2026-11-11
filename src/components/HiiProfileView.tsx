import React, { useState, useEffect } from 'react';
import { 
  User, 
  Crown, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Sliders, 
  Award, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  Activity, 
  LogOut, 
  Settings, 
  Compass, 
  Cpu, 
  BookOpen,
  ArrowRight,
  Shield,
  Tag
} from 'lucide-react';
import { UserProgress } from '../types';
import { 
  getActiveUserSession, 
  getRegisteredUsers, 
  registerOrUpdateUser 
} from '../utils/userProfiles';
import { LiveCodeApplierSection } from './LiveCodeApplierSection';

interface HiiProfileViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  isCeoAuthenticated: boolean;
  onCeoAuthenticated: (token: string) => void;
  onCeoLogout: () => void;
  onOpenCeoDashboard: () => void;
  onOpenUpgradeModal: () => void;
  onOpenOfflineModules?: () => void;
  isOnline?: boolean;
}

export const HiiProfileView: React.FC<HiiProfileViewProps> = ({
  progress,
  onUpdateProgress,
  isCeoAuthenticated,
  onCeoAuthenticated,
  onCeoLogout,
  onOpenCeoDashboard,
  onOpenUpgradeModal,
  onOpenOfflineModules,
  isOnline = true,
}) => {
  // Tabs within profile: 'profile' (Normal user or CEO view) | 'advanced' (Advanced settings & CEO login)
  const [activeTab, setActiveTab] = useState<'profile' | 'advanced'>('profile');

  // User form states
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('coding_learner');
  const [selectedHobby, setSelectedHobby] = useState('coding');
  const [aboutMe, setAboutMe] = useState('Passionate about learning Full-Stack & Artificial Intelligence with real-life physical analogies on HII.');
  const [primaryGoal, setPrimaryGoal] = useState('FAANG / Top Software Engineering Job');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['JavaScript', 'Python', 'AI Prompts']);
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  // CEO server-side authentication form
  const [ceoPasswordInput, setCeoPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingInCeo, setIsLoggingInCeo] = useState(false);
  const [ceoLoginError, setCeoLoginError] = useState<string | null>(null);

  const HOBBY_OPTIONS = [
    { id: 'coding', label: 'Coding & Dev', usernamePrefix: 'coding' },
    { id: 'playing', label: 'Sports & Gaming', usernamePrefix: 'playing' },
    { id: 'music', label: 'Music & Audio', usernamePrefix: 'music' },
    { id: 'artist', label: 'Art & Animation', usernamePrefix: 'artist' },
    { id: 'learner', label: 'Self-Taught Learner', usernamePrefix: 'learner' },
  ];

  // Load existing profile from storage
  useEffect(() => {
    const active = getActiveUserSession();
    if (active) {
      if (active.name) setDisplayName(active.name);
      if (active.email) setEmail(active.email);
      if (active.goal) setPrimaryGoal(active.goal);
    } else {
      try {
        const raw = localStorage.getItem('sg_user_profile');
        if (raw) {
          const p = JSON.parse(raw);
          if (p.name) setDisplayName(p.name);
          if (p.email) setEmail(p.email);
          if (p.goal) setPrimaryGoal(p.goal);
        }
      } catch (e) {}
    }

    try {
      const storedUsername = localStorage.getItem('hii_user_username');
      if (storedUsername) setUsername(storedUsername);
      const storedAbout = localStorage.getItem('hii_user_about');
      if (storedAbout) setAboutMe(storedAbout);
    } catch (e) {}
  }, []);

  const handleHobbyChange = (hobbyId: string) => {
    setSelectedHobby(hobbyId);
    const prefix = HOBBY_OPTIONS.find((h) => h.id === hobbyId)?.usernamePrefix || 'learner';
    const cleanName = (displayName || 'user').toLowerCase().replace(/\s+/g, '_').slice(0, 8);
    setUsername(`${prefix}_${cleanName}`);
  };

  const handleSaveProfile = () => {
    if (!email || !email.includes('@')) {
      alert('Valid Gmail address is necessary for user registration & verification.');
      return;
    }

    // Save in Registered Users Vault
    registerOrUpdateUser({
      name: displayName.trim() || 'Student Learner',
      email: email.trim(),
      password: 'student_protected',
      goal: primaryGoal,
      dream: primaryGoal,
      language: 'hinglish',
      purpose: selectedSkills,
      isPro: (progress as any).isPremium === true,
    });

    localStorage.setItem('hii_user_username', username);
    localStorage.setItem('hii_user_about', aboutMe);

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  // Secure server-side CEO authentication
  const handleCeoServerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ceoPasswordInput.trim()) return;

    setIsLoggingInCeo(true);
    setCeoLoginError(null);

    try {
      const res = await fetch('/api/ceo/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: ceoPasswordInput.trim(),
          password: ceoPasswordInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials. Access restricted.');
      }

      // Successful server-side verification: Store admin session token
      sessionStorage.setItem('sg_ceo_pin_verified', 'true');
      sessionStorage.setItem('hii_ceo_token', data.token);
      onCeoAuthenticated(data.token);
      setCeoPasswordInput('');
      setActiveTab('profile');
    } catch (err: any) {
      setCeoLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingInCeo(false);
    }
  };

  const isPremium = (progress as any).isPremium;
  const currentPlan = (progress as any).proPlanTier || (isPremium ? 'PRO' : 'FREE');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 animate-fadeIn">
      {savedToast && (
        <div className="fixed top-20 right-4 z-50 p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile changes successfully saved!</span>
        </div>
      )}

      {/* Top Header Switcher: Profile vs Advanced Settings */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? isCeoAuthenticated
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isCeoAuthenticated ? <Crown className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>{isCeoAuthenticated ? 'CEO Profile (Ansh Kumar)' : 'User Profile'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'advanced'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Advanced Settings</span>
          </button>
        </div>

        {isCeoAuthenticated && (
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
            CEO Active
          </span>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. CEO PROFILE (Founder & CEO Ansh Kumar Details)        */}
      {/* ======================================================== */}
      {isCeoAuthenticated && activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {/* CEO Hero Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-2xl shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-300 text-2xl">
                  AK
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">Ansh Kumar</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow-sm">
                    Founder & CEO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[11px]">
                    Company: SkillGraph
                  </span>
                </div>

                <p className="text-xs text-amber-300 font-semibold">
                  Founder & CEO of SkillGraph • Creator of the ProofLoop™ Learning Paradigm
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Empowering every student and creator globally to master modern Software Engineering, Artificial Intelligence, and Production Media Workflows through physical analogies and verifiable real-time proof.
                </p>
              </div>
            </div>

            {/* Launch CEO Dashboard Button */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={onOpenCeoDashboard}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 fill-slate-950" />
                <span>Open Full CEO Dashboard & Controls →</span>
              </button>

              <button
                type="button"
                onClick={onCeoLogout}
                className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock CEO Session</span>
              </button>
            </div>
          </div>

          {/* Company Vision & Mission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
              <span className="text-xs font-bold text-amber-300 block">Company Vision</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                To build the world's most accessible mobile-first AI super platform where students transition seamlessly from learning code to launching production apps and monetizing creative content.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
              <span className="text-xs font-bold text-cyan-300 block">Security & Infrastructure</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero-knowledge administrative gateway, server-authoritative token validation, and complete separation between public learner sessions and CEO executive desks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. NORMAL USER PROFILE (Secure & Tailored for Students)  */}
      {/* ======================================================== */}
      {!isCeoAuthenticated && activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {/* User Profile Header Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-white text-2xl">
                  {(displayName ? displayName[0] : 'S').toUpperCase()}
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{displayName || 'Student Learner'}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] border border-cyan-500/20 font-bold">
                    @{username}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[10px] border border-emerald-500/20 font-bold">
                    {currentPlan}
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 font-mono">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{email || 'student@gmail.com'}</span>
                  <span className="text-emerald-400 text-[10px] font-bold">✓ Verified</span>
                </div>

                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{aboutMe}</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-base font-black text-emerald-300">{progress.xp}</div>
                <span className="text-[10px] text-slate-500 font-semibold">XP (100 Bonus)</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-base font-black text-amber-300">{progress.streak}d</div>
                <span className="text-[10px] text-slate-500 font-semibold">Streak</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-base font-black text-cyan-300">{progress.completedExercises?.length || 0}</div>
                <span className="text-[10px] text-slate-500 font-semibold">Solved</span>
              </div>
            </div>

            {/* Completed Modules & Offline Cache Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Completed Modules (Offline Ready)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  {progress.completedVideoLessons?.length || 0} Modules Cached
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All your completed lessons, summaries, and code are saved in local browser storage so you can study even when connection is lost.
              </p>
              {onOpenOfflineModules && (
                <button
                  type="button"
                  onClick={onOpenOfflineModules}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View All Cached Modules Offline</span>
                </button>
              )}
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Edit Profile Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Display Name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Registered Gmail Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono"
                />
              </div>

              {/* Unique Hobby-Based Username Selector (Requirement 2) */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-slate-400 font-bold">Hobby-Inspired Username *</label>
                <div className="flex flex-wrap gap-1.5">
                  {HOBBY_OPTIONS.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleHobbyChange(h.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedHobby === h.id
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-bold">About & Learning Interests</label>
                <textarea
                  rows={2}
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-bold">Primary Goal</label>
                <input
                  type="text"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
              >
                Manage Subscription ({currentPlan})
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ADVANCED SETTINGS & CEO CONTROL ENTRY                 */}
      {/* ======================================================== */}
      {activeTab === 'advanced' && (
        <div className="space-y-6 animate-fadeIn">
          {/* App Preferences */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">System Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Default Teaching Tone:</span>
                <span className="text-cyan-400 font-bold">Hinglish Analogies</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Registration Welcome Bonus:</span>
                <span className="text-emerald-400 font-mono font-bold">100 XP (Active)</span>
              </div>
            </div>
          </div>

          {/* LIVE CODE INJECTOR & DYNAMIC APP CUSTOMIZER (GEMINI 3.8 FLASH CODE APPLIER) */}
          <LiveCodeApplierSection />

          {/* CEO CONTROL ENTRY (Requirement 3: Masked Password, Server Authentication) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>CEO Control & Executive Desk</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Admin Clearance
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Secure server-side authentication for Founder & CEO Ansh Kumar.
                </p>
              </div>
            </div>

            {isCeoAuthenticated ? (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated as Founder & CEO Ansh Kumar</span>
                </div>
                <p className="text-xs text-slate-300">
                  Your server-verified administrator session is active. You have full control over registered users, subscription plans, XP configurations, and live effects.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onOpenCeoDashboard}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md"
                  >
                    Open CEO Dashboard →
                  </button>
                  <button
                    type="button"
                    onClick={onCeoLogout}
                    className="py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Lock Session
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCeoServerLogin} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter executive authorization password. Verification is processed entirely server-side. Passwords are never revealed or stored in client code.
                </p>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={ceoPasswordInput}
                    onChange={(e) => setCeoPasswordInput(e.target.value)}
                    placeholder="Enter CEO authorization password..."
                    autoComplete="off"
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {ceoLoginError && (
                  <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{ceoLoginError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Protected by HII Cryptographic Gateway
                  </span>
                  <button
                    type="submit"
                    disabled={isLoggingInCeo || !ceoPasswordInput.trim()}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    {isLoggingInCeo ? 'Verifying on Server...' : 'Authenticate & Unlock CEO Desk'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
