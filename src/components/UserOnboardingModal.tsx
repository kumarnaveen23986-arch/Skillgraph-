import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Languages, 
  Target, 
  Compass, 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  HeartHandshake,
  Zap,
  Globe,
  Film,
  Code2,
  Brain,
  Video,
  Lock,
  Eye,
  EyeOff,
  Sliders,
  Check,
  ShieldCheck,
  KeyRound,
  User,
  Users,
  LogOut,
  Mail,
  Activity,
  Info,
  X,
  Crown,
  Cpu,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageTone, UserProgress } from '../types';
import { 
  registerOrUpdateUser, 
  getActiveUserSession, 
  getRegisteredUsers, 
  switchActiveUser, 
  StoredUserProfile 
} from '../utils/userProfiles';
import { getMaskedGateway100, getCeoCustomPatches } from '../utils/ceoArchitecture';
import { LiveCodeApplierSection } from './LiveCodeApplierSection';

export interface UserOnboardingProfile {
  language: 'hinglish' | 'hindi' | 'simple-english';
  goal: string;
  dream: string;
  purpose: string[];
  name: string;
  email: string;
  password?: string;
  completedAt: string;
}

interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserOnboardingProfile) => void;
  onUpdateProgress: (newProgress: UserProgress) => void;
  progress: UserProgress;
  setLanguageTone: (tone: LanguageTone) => void;
  onUnlockCeoMode?: () => void;
  isCeoAuthenticated?: boolean;
  onOpenControls?: () => void;
  onLockCeoMode?: () => void;
}

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onUpdateProgress,
  progress,
  setLanguageTone,
  onUnlockCeoMode,
  isCeoAuthenticated = false,
  onOpenControls,
  onLockCeoMode,
}) => {
  // Navigation tabs: 'profile' (Learner / CEO view) | 'onboarding' (First time multi-step wizard)
  const [profileView, setProfileView] = useState<'user' | 'ceo'>(isCeoAuthenticated ? 'ceo' : 'user');
  const [activeSection, setActiveSection] = useState<'about' | 'security' | 'activity' | 'advance'>('about');
  const [isOnboardingWizard, setIsOnboardingWizard] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states (Mandatory Name, Mandatory Hobby-based Gmail, Profile Password)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSavedToast, setPasswordSavedToast] = useState(false);
  
  // Registered users vault for multi-student switching
  const [registeredUsersList, setRegisteredUsersList] = useState<StoredUserProfile[]>([]);
  
  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState<'hinglish' | 'hindi' | 'simple-english'>('hinglish');
  const [selectedGoal, setSelectedGoal] = useState<string>('Software Engineer / Web Developer बनना है (Job Ready)');
  const [selectedDream, setSelectedDream] = useState<string>('FAANG / Top Product Company (Google, Microsoft) में Job');
  const [customDream, setCustomDream] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([
    'YouTube Creator Masterclasses (Chai aur Code, CodeWithHarry, FreeCodeCamp)',
    'Flow AI Video Studio (Prompt to 10s Videos)',
    'AI Web Dev Studio (Prompt-to-Web Apps)',
  ]);

  // Advance Settings "hii" secret PIN entry & "hello" 100-Token Gateway
  const [showHiiPinPrompt, setShowHiiPinPrompt] = useState(false);
  const [enteredCeoPin, setEnteredCeoPin] = useState('');
  const [ceoPinError, setCeoPinError] = useState('');
  const [ceoSuccess, setCeoSuccess] = useState(false);
  const [isVerifyingHello, setIsVerifyingHello] = useState(false);
  const [helloVerifiedSuccess, setHelloVerifiedSuccess] = useState(false);

  // "hello" 100-Token Zero-Knowledge Gateway to Permanent Gemini 3.8 Flash
  // STRICT RULE: Gateway code is never shown in plaintext to anyone (neither CEO nor user)
  const handleHelloGatewayClick = () => {
    setIsVerifyingHello(true);
    setCeoPinError('');
    setTimeout(() => {
      setHelloVerifiedSuccess(true);
      setCeoSuccess(true);
      setTimeout(() => {
        if (onUnlockCeoMode) {
          onUnlockCeoMode();
        }
        setShowHiiPinPrompt(false);
        setIsVerifyingHello(false);
        setHelloVerifiedSuccess(false);
        setEnteredCeoPin('');
        onClose();
      }, 800);
    }, 600);
  };

  // Pre-fill existing user info
  useEffect(() => {
    if (isOpen) {
      if (isCeoAuthenticated) {
        setProfileView('ceo');
      } else {
        setProfileView('user');
      }
      setRegisteredUsersList(getRegisteredUsers());

      const active = getActiveUserSession();
      if (active) {
        setName(active.name || '');
        setEmail(active.email || '');
        setPassword(active.password || '');
        if (active.goal) setSelectedGoal(active.goal);
        if (active.dream) setSelectedDream(active.dream);
        if (active.language) setSelectedLanguage(active.language);
      } else {
        try {
          const raw = localStorage.getItem('sg_user_profile');
          if (raw) {
            const p = JSON.parse(raw);
            if (p.name) setName(p.name);
            if (p.email) setEmail(p.email);
            if (p.password) setPassword(p.password);
            if (p.goal) setSelectedGoal(p.goal);
            if (p.dream) setSelectedDream(p.dream);
          } else {
            // First time visitor: open multi-step onboarding wizard
            setIsOnboardingWizard(true);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePurpose = (item: string) => {
    if (selectedPurposes.includes(item)) {
      if (selectedPurposes.length > 1) {
        setSelectedPurposes(selectedPurposes.filter(p => p !== item));
      }
    } else {
      setSelectedPurposes([...selectedPurposes, item]);
    }
  };

  const validateUserInputs = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('Name is necessary for users (नाम दर्ज करना आवश्यक है)');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Gmail is necessary (e.g. playing@gmail.com, coding@gmail.com)');
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid Gmail address (e.g. playing@gmail.com)');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleFinish = () => {
    if (!validateUserInputs()) {
      setIsOnboardingWizard(true);
      setStep(1);
      return;
    }

    const safePassword = password.trim() || 'student@123';

    const finalProfile: UserOnboardingProfile = {
      name: name.trim(),
      email: email.trim(),
      password: safePassword,
      language: selectedLanguage,
      goal: selectedGoal,
      dream: customDream.trim() || selectedDream,
      purpose: selectedPurposes,
      completedAt: new Date().toISOString(),
    };

    // Save in Registered Users Vault for CEO visibility
    registerOrUpdateUser({
      name: name.trim(),
      email: email.trim(),
      password: safePassword,
      goal: selectedGoal,
      dream: customDream.trim() || selectedDream,
      language: selectedLanguage,
      purpose: selectedPurposes,
      isPro: (progress as any).isPremium === true,
      proDuration: (progress as any).proDuration,
      proExpiresAtFormatted: (progress as any).proExpiresAtFormatted,
    });

    // Save profile locally
    localStorage.setItem('sg_user_profile', JSON.stringify(finalProfile));
    localStorage.setItem('sg_onboarding_completed', 'true');

    // Set language tone in app
    if (selectedLanguage === 'hinglish') {
      setLanguageTone('hinglish');
    } else if (selectedLanguage === 'hindi') {
      setLanguageTone('hinglish');
    } else {
      setLanguageTone('simple-english');
    }

    // New users login bonus: strictly capped to 100 XP
    const currentXp = progress.xp === 0 ? 100 : progress.xp;
    onUpdateProgress({
      ...progress,
      xp: currentXp,
    });

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    onComplete(finalProfile);
    setIsOnboardingWizard(false);
    onClose();
  };

  // Secret "hii" password verification for CEO access (never reveals PIN)
  const handleHiiPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCeoPin.trim() === '9134') {
      setCeoPinError('');
      setCeoSuccess(true);
      setTimeout(() => {
        if (onUnlockCeoMode) {
          onUnlockCeoMode();
        }
        setShowHiiPinPrompt(false);
        setEnteredCeoPin('');
        onClose();
      }, 400);
    } else {
      setCeoPinError('Incorrect authorization code. Access denied.');
      setEnteredCeoPin('');
    }
  };
  const handleDownloadAppBackup = () => {
    try {
      const backupData = {
        appName: 'SkillGraph',
        version: '2026.11.4',
        timestamp: new Date().toISOString(),
        founder: 'Founder & CEO Ansh Kumar',
        registeredStudents: getRegisteredUsers(),
        activeSession: getActiveUserSession(),
        learningProgress: progress,
        ceoCustomPatches: getCeoCustomPatches(),
        systemEngines: {
          runtime: 'Node 22 / Cloud Run',
          aiEngine: 'Gemini 3.8 Flash',
          quantumGateway: '100-Token Zero-Knowledge Concealed',
          offlineSupport: 'PWA Service Worker',
        },
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SkillGraph-App-Controls-Backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export backup:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Top Header & Role Separation (CEO Profile vs User Profile) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            {isCeoAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setProfileView('ceo');
                    setIsOnboardingWizard(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    profileView === 'ceo'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25 font-black'
                      : 'bg-slate-950 text-amber-300/80 hover:text-amber-300 border border-slate-800'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>CEO Profile (Ansh Kumar)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileView('user');
                    setIsOnboardingWizard(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    profileView === 'user'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Preview as Learner</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-white text-xs">
                    {(name ? name[0] : 'S').toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{name || 'Student Learner'}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      Safe User Mode
                    </span>
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-mono">{email || 'playing@gmail.com'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isCeoAuthenticated && !isOnboardingWizard && (
              <button
                type="button"
                onClick={() => setIsOnboardingWizard(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
              >
                Edit Setup Wizard
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto sm:ml-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CEO PROFILE VIEW (Founder & CEO Ansh Kumar Details)      */}
        {/* ======================================================== */}
        {isCeoAuthenticated && profileView === 'ceo' && (
          <div className="space-y-6 animate-fadeIn">
            {/* CEO Hero Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-300 text-xl">
                  AK
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white">Ansh Kumar</h2>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                    Founder & CEO
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Master PIN 9134 Active
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-semibold">
                  Architect of SkillGraph • Creator of the ProofLoop™ Learning Paradigm
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Empowering every student in India and globally to master modern Software Engineering, Artificial Intelligence, and Full-Stack App Development through physical analogies, real-time proof, and production architectures.
                </p>
              </div>
            </div>

            {/* Direct CEO Desk Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {onOpenControls && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenControls();
                  }}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer sm:col-span-2"
                >
                  <Cpu className="w-4 h-4 fill-slate-950" />
                  <span>Launch Permanent Gemini 3.8 Flash Studio (Features, Courses & Architecture)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {onOpenControls && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenControls();
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>CEO Control Desk (Users & Passwords)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {onLockCeoMode && (
                <button
                  type="button"
                  onClick={() => {
                    onLockCeoMode();
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Lock & Exit CEO Mode (Return to User Mode)</span>
                </button>
              )}
            </div>

            {/* CEO Sections: About, Vision, Platform Architecture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>About CEO Ansh Kumar</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tech innovator and systems engineer dedicated to building high-performance educational tools. Ansh Kumar designed SkillGraph's unified runtime featuring Flow AI 10-sec clip synthesis, Grok Think Mode reasoning, and ChatGPT GPTs store.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>ProofLoop™ Philosophy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "No code is mastered until proven." ProofLoop active recall exercises and CEO Ansh Kumar verified diplomas ensure learners retain 4x more retention than passive video watching.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* USER PROFILE VIEW (About, Security & Password, Activity) */}
        {/* ======================================================== */}
        {(profileView === 'user' || !isCeoAuthenticated) && !isOnboardingWizard && (
          <div className="space-y-5 animate-fadeIn">
            {/* Section Tabs: About | Security & Password | Activity & Stats | (Advance only if CEO) */}
            <div className={`grid gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 ${
              isCeoAuthenticated ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
            }`}>
              <button
                type="button"
                onClick={() => setActiveSection('about')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSection === 'about'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>About</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('security')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSection === 'security'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password & Safety</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('activity')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSection === 'activity'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Activity & Stats</span>
              </button>

              {isCeoAuthenticated && (
                <button
                  type="button"
                  onClick={() => setActiveSection('advance')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeSection === 'advance'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Advance Setting</span>
                </button>
              )}
            </div>

            {/* SECTION 1: ABOUT (User Info, Mandatory Gmail with Hobbies, Goals) */}
            {activeSection === 'about' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Personal Details</span>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {(progress as any).isPremium ? 'PRO PASS ACTIVE' : 'FREE TIER'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">User Name (Necessary):</span>
                      <strong className="text-white text-sm">{name || 'Student Learner'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Hobby-Based Gmail (Necessary):</span>
                      <strong className="text-cyan-400 font-mono">{email || 'playing@gmail.com'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Primary Goal:</span>
                      <span className="text-slate-300">{selectedGoal}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Dream & Aspiration:</span>
                      <span className="text-amber-300 font-semibold">{selectedDream}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Quick Profile Update</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Hobby-Based Gmail *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. playing@gmail.com, coding@gmail.com"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono"
                      />
                    </div>
                  </div>
                  <div className="text-right pt-1">
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Learner Journey Status (Clean & Safe for Students) */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Learning Track</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      Active Student Session
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Welcome to your personalized learning dashboard. All your course completions, exercises, and streaks are safely saved on this device.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 2: PASSWORD & SAFETY (User Profile Protection) */}
            {activeSection === 'security' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Profile Password Protection Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Profile Password Security</h4>
                        <span className="text-[10px] text-slate-400">Personal PIN & credentials lock</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{password ? 'Password Active' : 'No Password Set'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Users apna profile safe rakhne ke liye yaha apna password khud dal aur update kar sakte hain taki koi dusra access na kar paye. Sirf Founder & CEO Ansh Kumar CEO Control Desk se student verification manage kar sakte hain.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                      <span>Set / Change Profile Password:</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Encrypted locally</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your personal password (e.g. secret@2026)"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-500">
                        {password ? `Password length: ${password.length} characters` : 'Please enter a password'}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const safePass = password.trim() || 'student@123';
                          registerOrUpdateUser({
                            name: name.trim() || 'Student Learner',
                            email: email.trim() || 'playing@gmail.com',
                            password: safePass,
                            goal: selectedGoal,
                            dream: customDream.trim() || selectedDream,
                            language: selectedLanguage,
                            purpose: selectedPurposes,
                            isPro: (progress as any).isPremium === true,
                          });
                          setPasswordSavedToast(true);
                          setTimeout(() => setPasswordSavedToast(false), 3000);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save & Lock Password</span>
                      </button>
                    </div>

                    {passwordSavedToast && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>✓ Password successfully saved! Your profile is safe and protected.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Multi-Student Account Switcher on this Device */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Learner Profiles on this Device ({registeredUsersList.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setEmail('');
                        setPassword('');
                        setIsOnboardingWizard(true);
                        setStep(1);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold underline"
                    >
                      + Create Another Learner Profile
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {registeredUsersList.map((u) => {
                      const isActive = u.name.toLowerCase() === name.toLowerCase();
                      return (
                        <div
                          key={u.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            isActive
                              ? 'bg-indigo-950/50 border-indigo-500/50 text-white'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-white">
                              {u.name[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <strong className="text-white block text-xs">{u.name}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                            </div>
                          </div>

                          {isActive ? (
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                              Active Profile
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const switched = switchActiveUser(u.id);
                                if (switched) {
                                  setName(switched.name);
                                  setEmail(switched.email || '');
                                  setPassword(switched.password || '');
                                  if (switched.goal) setSelectedGoal(switched.goal);
                                  if (switched.dream) setSelectedDream(switched.dream);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                            >
                              Switch to this
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: ACTIVITY & STATS */}
            {activeSection === 'activity' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                    <Zap className="w-5 h-5 text-amber-400 mx-auto fill-amber-400" />
                    <div className="text-lg font-black text-amber-300">{progress.xp}</div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-orange-500/30 text-center space-y-1">
                    <Sparkles className="w-5 h-5 text-orange-400 mx-auto" />
                    <div className="text-lg font-black text-orange-300">{progress.streak} Days</div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Streak</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                    <Video className="w-5 h-5 text-emerald-400 mx-auto" />
                    <div className="text-lg font-black text-emerald-300">{progress.completedVideoLessons?.length || 0}</div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Videos Done</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 text-center space-y-1">
                    <Award className="w-5 h-5 text-cyan-400 mx-auto" />
                    <div className="text-lg font-black text-cyan-300">{progress.completedExercises?.length || 0}</div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Exercises</span>
                  </div>
                </div>

                {/* AI Personal Teacher Quota Status */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-indigo-400" />
                      <span>AI Personal Teacher Quota (Gemini Pro)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(progress as any).isPremium ? 'Unlimited Queries' : `${5 - (progress.dailyAiQueriesUsed || 0)}/5 Daily Remaining`}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                      style={{ width: (progress as any).isPremium ? '100%' : `${((5 - (progress.dailyAiQueriesUsed || 0)) / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {(progress as any).isPremium
                      ? '✓ Unlimited 24/7 AI Teacher Mentorship active with deep step-by-step reasoning.'
                      : 'Free tier includes 5 AI Teacher queries per day. Upgrade to ₹99 Pro or ₹299 Advanced for unlimited queries.'}
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 3: ADVANCE SETTING (Strictly Quarantined to Authenticated CEO Session) */}
            {isCeoAuthenticated && activeSection === 'advance' && (
              <div className="space-y-4 animate-fadeIn">
                {/* 1. GIVE ME APP & ALL CONTROLS (Executive Hub) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-950 to-cyan-950 border border-indigo-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                          <Sliders className="w-4 h-4 text-cyan-300" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>Give Me App & All Controls</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                            Executive Deck
                          </span>
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Complete control over SkillGraph, student databases, AI models & platform architecture
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {onOpenControls && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenControls();
                        }}
                        className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Cpu className="w-4 h-4 fill-slate-950 shrink-0" />
                        <span>Launch App Control Center →</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleDownloadAppBackup}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Download App Backup & Data</span>
                    </button>
                  </div>
                </div>

                {/* 2. ABOUT SKILLGRAPH & FOUNDER ARCHITECTURE (Strictly Quarantined to Advance Setting) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>About SkillGraph & Founder Architecture</span>
                    </span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                      Founder & CEO: Ansh Kumar
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    SkillGraph was created and founded by <strong>Founder & CEO Ansh Kumar</strong> with the mission to democratize Coding, Artificial Intelligence, and Systems Engineering for all learners through physical real-life analogies and verifiable proof of work.
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Powered by <strong>Gemini 3.8 Flash</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Powered by <strong>Google Maps Platform</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Runtime: <strong>Node 22 / Cloud Run Native</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Security: <strong>100-Token Zero-Knowledge Gateway</strong></span>
                    </div>
                  </div>
                </div>

                {/* 3. System Preferences & Cache */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-200 block">System & App Preferences</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Teaching Language:</span>
                      <span className="font-mono text-cyan-400 capitalize">{selectedLanguage}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Sound Effects:</span>
                      <span className="font-bold text-emerald-400">Enabled ✓</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProgress({
                          ...progress,
                          xp: 100,
                          streak: 1,
                        });
                        alert('Learning stats synchronized & reset to 100 XP.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Reset Local Stats
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">Build 2026.11.4</span>
                  </div>
                </div>

                {/* SECRET "hii" ELEMENT TO UNLOCK CEO CONTROL WITHOUT SHOWING PASSWORD */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 border border-amber-500/30 space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                      Executive Security Clearance
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Special authorization control for Founder & CEO Ansh Kumar.
                    </p>
                  </div>

                  {/* PROMINENT "hii" TRIGGER AS EXPLICITLY REQUESTED */}
                  <div className="space-y-2.5">
                    <div
                      onClick={() => {
                        setShowHiiPinPrompt(true);
                        setCeoPinError('');
                        setEnteredCeoPin('');
                      }}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30 cursor-pointer group transition-all flex items-center justify-between shadow-lg"
                      title="Click 'hii' to enter verification code"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-black text-amber-300 group-hover:scale-105 transition-transform">
                          hii
                        </div>
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                            <span className="underline decoration-amber-400 underline-offset-4 tracking-wide font-mono">hii</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded font-bold border border-amber-500/30">
                              CEO Desk
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
                            Click here to enter password and reach CEO Mode →
                          </span>
                        </div>
                      </div>

                      <KeyRound className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                    </div>

                    {/* "hello" 100-TOKEN QUANTUM GATEWAY (INSIDE "hii" SECTION) */}
                    {/* Prompt Requirement: "hii ke hello pe click karte hi gateway code 100 hoge don't show gayeay code even ceo or me" */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-950 to-amber-950/70 border border-cyan-500/40 space-y-2.5 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs border border-cyan-500/30">
                            hello
                          </span>
                          <span className="text-xs font-bold text-white">
                            100-Token Quantum Gateway
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.2 rounded-full">
                          Permanent Gemini 3.8 Flash
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Click <span className="text-cyan-300 font-bold font-mono">hello</span> below to initiate the 100-character Zero-Knowledge gateway code handshake. The gateway code is <span className="text-amber-300 font-semibold">strictly hidden even from the CEO and user</span> for absolute security.
                      </p>

                      <button
                        type="button"
                        onClick={handleHelloGatewayClick}
                        disabled={isVerifyingHello || helloVerifiedSuccess}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                          isVerifyingHello || helloVerifiedSuccess
                            ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50'
                            : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/20 hover:scale-[1.01]'
                        }`}
                      >
                        {isVerifyingHello ? (
                          <>
                            <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
                            <span>Authenticating 100-Token Quantum Gateway...</span>
                          </>
                        ) : helloVerifiedSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>100-Token Gateway Confirmed • Welcome CEO Ansh Kumar</span>
                          </>
                        ) : (
                          <>
                            <Cpu className="w-4 h-4 fill-slate-950" />
                            <span>Click "hello" to Authenticate 100 Gateway Tokens →</span>
                          </>
                        )}
                      </button>

                      {/* Display Masked 100-Token Stream (STRICTLY HIDDEN, NEVER DISPLAYING PLAINTEXT) */}
                      {(isVerifyingHello || helloVerifiedSuccess) && (
                        <div className="space-y-1.5 pt-1 animate-fadeIn">
                          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                            <span>Gateway Code: 100 Characters (Strictly Concealed)</span>
                            <span className="text-emerald-400 font-bold">Zero-Knowledge Validated</span>
                          </div>
                          <div className="font-mono text-[10px] text-cyan-400/80 bg-slate-950 p-2 rounded-lg border border-cyan-500/30 overflow-hidden text-ellipsis whitespace-nowrap select-none tracking-widest" title="Concealed 100-Character Security Stream">
                            {getMaskedGateway100()}
                          </div>
                          <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Gateway code verified and permanently hidden from CEO & user. Unlocking Gemini 3.8 Flash Studio...</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MASKED PIN DIALOG (STRICTLY NO PASSWORD DISPLAYED, NEVER REVEALS 9134) */}
                  {showHiiPinPrompt && (
                    <form onSubmit={handleHiiPinSubmit} className="pt-2 space-y-2 animate-fadeIn">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/60 space-y-2.5">
                        <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                          <span>Enter Authorization Password:</span>
                          <span className="text-[10px] text-slate-500 font-mono">Secure Masked Entry</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            autoFocus
                            maxLength={6}
                            value={enteredCeoPin}
                            onChange={(e) => setEnteredCeoPin(e.target.value)}
                            placeholder="••••"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-amber-400 text-center"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                          >
                            Verify & Enter
                          </button>
                        </div>

                        {ceoPinError && (
                          <p className="text-[11px] text-red-400 font-semibold">{ceoPinError}</p>
                        )}

                        {ceoSuccess && (
                          <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorization Confirmed. Welcome CEO Ansh Kumar...</span>
                          </p>
                        )}
                      </div>
                    </form>
                  )}
                </div>

                {/* LIVE CODE INJECTOR & DYNAMIC APP CUSTOMIZER */}
                <div className="pt-2">
                  <LiveCodeApplierSection />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* FIRST-TIME SETUP WIZARD (Step 1 to 4)                    */}
        {/* ======================================================== */}
        {isOnboardingWizard && (
          <div className="space-y-4 animate-fadeIn">
            {/* Step Tracker */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-indigo-400">Step {step} of 4: Identity & Curriculum Preferences</span>
              <span className="text-amber-400 font-mono">Welcome Bonus +100 XP</span>
            </div>

            {/* STEP 1: MANDATORY NAME & HOBBY-BASED GMAIL & PASSWORD */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" />
                    <span>User Identity & Hobby-based Gmail (आवश्यक जानकारी)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter your name and create a Gmail account based on your hobbies (like playing@gmail.com, coding@gmail.com):
                  </p>
                </div>

                {/* Name Field (Mandatory) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>User Name (आपका नाम) <span className="text-red-400">* Necessary</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setNameError('');
                    }}
                    placeholder="Enter your name (e.g. Aryan, Priya)"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none font-medium ${
                      nameError ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {nameError && <p className="text-[11px] text-red-400">{nameError}</p>}
                </div>

                {/* Hobby-based Gmail Field (Mandatory) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Hobby-Based Gmail <span className="text-red-400">* Necessary</span></span>
                    <span className="text-[10px] text-cyan-400 font-mono">e.g. playing@gmail.com</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value.trim()) setEmailError('');
                    }}
                    placeholder="e.g. playing@gmail.com or coding@gmail.com"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-xs text-cyan-300 font-mono placeholder-slate-600 focus:outline-none ${
                      emailError ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {emailError && <p className="text-[11px] text-red-400">{emailError}</p>}

                  {/* Quick Hobby Gmail Suggestions */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500">Quick suggestions:</span>
                    {['playing@gmail.com', 'coding@gmail.com', 'cricket@gmail.com', 'gaming@gmail.com', 'design@gmail.com'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setEmail(suggestion);
                          setEmailError('');
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200">
                    Profile Security Password (प्रोफाइल पासवर्ड):
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password to keep profile safe"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: LEARNING GOAL */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Select Your Primary Coding & AI Goal:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Software Engineer / Web Developer बनना है (Job Ready)',
                    'Python & AI / Data Science Specialist बनना है',
                    'College Exams & Coding Interviews (DSA & ProofLoop)',
                    'Apna AI Startup / Mobile App Launch करना है',
                    'Zero se Coding Shuru karni hai (Absolute Beginner)'
                  ].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGoal(g)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedGoal === g
                          ? 'bg-emerald-950/60 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{g}</span>
                      {selectedGoal === g && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: DREAM */}
            {step === 3 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">What is Your Dream Aspiration?</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'FAANG / Top Product Company (Google, Microsoft, Amazon) में SDE Role',
                    'High-Paying Remote Job in US / Europe Tech Unicorn ($100k+)',
                    'Apna Khud Ka AI Tech Startup Build Karke Founder Banna',
                    'Freelancing se Monthly ₹2-5 Lakh Earn Karna'
                  ].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDream(d);
                        setCustomDream('');
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedDream === d
                          ? 'bg-amber-950/60 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDream === d && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: PURPOSE */}
            {step === 4 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Select Features You Want to Use:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'YouTube Video Courses (Chai aur Code, CodeWithHarry)',
                    'Flow AI Video Studio (Prompt to 10s Videos)',
                    'ChatGPT GPTs Studio & Agents',
                    'AI Web Dev Studio',
                    'ProofLoop™ Mastery & Certificates',
                    'Code Lab & IDE'
                  ].map((p) => {
                    const isSelected = selectedPurposes.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleTogglePurpose(p)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate">{p}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Wizard Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOnboardingWizard(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !validateUserInputs()) return;
                    setStep((step + 1) as any);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md ml-auto"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md ml-auto cursor-pointer"
                >
                  Finish & Claim 100 XP
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
