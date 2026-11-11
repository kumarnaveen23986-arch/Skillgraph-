import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { SkillGraphView } from './components/SkillGraphView';
import { AICourseView } from './components/AICourseView';
import { ProofLoopView } from './components/ProofLoopView';
import { AskAIView } from './components/AskAIView';
import { CodeLabView } from './components/CodeLabView';
import { BugDoctorView } from './components/BugDoctorView';
import { GoogleMapsLabView } from './components/GoogleMapsLabView';
import { ForumView } from './components/ForumView';
import { GitHubHubView } from './components/GitHubHubView';
import { VisualSimulatorsView } from './components/VisualSimulatorsView';
import { PlayStoreLaunchKit } from './components/PlayStoreLaunchKit';
import { AppControlModal } from './components/AppControlModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { VideoCoursesHub } from './components/VideoCoursesHub';
import { FlowAIVideoStudio } from './components/FlowAIVideoStudio';
import { WebDevStudio } from './components/WebDevStudio';
import { GrokAIStudio } from './components/GrokAIStudio';
import { ChatGPTStudio } from './components/ChatGPTStudio';
import { ExploreHub } from './components/ExploreHub';
import { PaymentModal } from './components/PaymentModal';
import { SafeShareModal } from './components/SafeShareModal';
import { FounderAuthModal } from './components/FounderAuthModal';
import { UserOnboardingModal } from './components/UserOnboardingModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { StreakMotivationModal } from './components/StreakMotivationModal';
import { HiiHomeView } from './components/HiiHomeView';
import { HiiAIToolsHub } from './components/HiiAIToolsHub';
import { HiiActivityView } from './components/HiiActivityView';
import { HiiProfileView } from './components/HiiProfileView';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OfflineModulesModal } from './components/OfflineModulesModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LanguageTone, UserProgress } from './types';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { getProRequests } from './utils/proRequests';
import { initLiveCodeApplier } from './utils/liveCodeApplier';
import { Lock, Bell, KeyRound } from 'lucide-react';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Code2, 
  Stethoscope, 
  MessageSquare, 
  BookOpen, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCw,
  Github,
  Globe2,
  Award,
  Smartphone,
  Video,
  Film,
  Globe,
  Brain,
  User
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [languageTone, setLanguageTone] = useState<LanguageTone>('hinglish');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const { isOnline } = useOnlineStatus();
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSafeShareModalOpen, setIsSafeShareModalOpen] = useState(false);
  const [isFounderAuthModalOpen, setIsFounderAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('sg_onboarding_completed');
    } catch (e) {
      return false;
    }
  });

  // Strict Security Hardening: Public links & shared URLs NEVER grant CEO controls.
  // CEO control can ONLY be unlocked via the secret "hii" verification dialog in Advance Settings.
  const [isCeoAuthenticated, setIsCeoAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sg_ceo_pin_verified') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Force Safe User Mode for learners and shared link visitors
  const [isUserMode, setIsUserMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sg_ceo_pin_verified') !== 'true';
    } catch (e) {
      return true;
    }
  });

  const [pendingProCount, setPendingProCount] = useState<number>(() => {
    try {
      return getProRequests().filter(r => r.status === 'pending').length;
    } catch (e) {
      return 0;
    }
  });

  // Google Maps Platform Quota Defense State
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);

    // Continuous Cross-Device Cloud Sync with Downloaded Mobile App (Gemini 3.8 Flash Patches)
    initLiveCodeApplier();

    // Strict URL Sanitization: Strip any query params from address bar immediately
    // so no attacker can tamper with parameters in shared links
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Sync Pro pass requests count
    const syncPro = () => {
      setPendingProCount(getProRequests().filter(r => r.status === 'pending').length);
    };
    window.addEventListener('pro-request-updated', syncPro);
    window.addEventListener('storage', syncPro);

    // Keyboard shortcuts:
    // 1. Ctrl+K / Cmd+K opens Searchable Command Palette
    // 2. Ctrl+Shift+A opens masked CEO PIN modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsFounderAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
      window.removeEventListener('pro-request-updated', syncPro);
      window.removeEventListener('storage', syncPro);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Deep linking cross-tab states
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(undefined);
  const [injectedCode, setInjectedCode] = useState<string | undefined>(undefined);
  const [askQuestionQuery, setAskQuestionQuery] = useState<string | undefined>(undefined);
  const [exportedGitHubData, setExportedGitHubData] = useState<any>(undefined);

  // Sync to localStorage
  const handleUpdateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveUserProgress(newProgress);
  };

  // Jump from SkillGraph to CodeLab
  const handleSelectSkillForExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setInjectedCode(undefined);
    setActiveTab('codelab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump from SkillGraph to AskAI
  const handleAskTopic = (topicTitle: string) => {
    setAskQuestionQuery(`Explain ${topicTitle} with a real-life analogy`);
    setActiveTab('ask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to CodeLab with injected code
  const handleJumpToCodeLabWithCode = (code: string) => {
    setInjectedCode(code);
    setSelectedExerciseId(undefined);
    setActiveTab('codelab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump from ProofLoop to GitHub Hub
  const handleOpenGitHubHub = (projectData: any) => {
    setExportedGitHubData(projectData);
    setActiveTab('github');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Required Google Maps Platform Demo Quota Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        languageTone={languageTone}
        setLanguageTone={setLanguageTone}
        progress={progress}
        onOpenQuickAsk={() => {
          setActiveTab('ask');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenControls={() => setIsControlModalOpen(true)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onOpenProfile={() => setIsOnboardingModalOpen(true)}
        isUserMode={isUserMode}
        onToggleUserMode={() => setIsUserMode(!isUserMode)}
        isCeoAuthenticated={isCeoAuthenticated}
        onOpenFounderAuth={() => setIsFounderAuthModalOpen(true)}
        onOpenSafeShare={() => setIsSafeShareModalOpen(true)}
        pendingProCount={pendingProCount}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        isOnline={isOnline}
        onOpenOfflineModules={() => setIsOfflineModalOpen(true)}
      />

      {/* Daily Motivation & Dynamic Banner */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border-b border-indigo-900/40 px-4 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left Title / Mode Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-slate-200 flex items-center gap-1.5 flex-wrap">
              {isCeoAuthenticated && !isUserMode ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 Executive Master Control Active</span>
                </span>
              ) : (
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <span>📱 Student Safe Edition • Tamper-Proof & High Speed</span>
                </span>
              )}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* CEO Mode Only Actions */}
            {isCeoAuthenticated && !isUserMode ? (
              <>
                {/* Pending Pro Approval Notification */}
                {pendingProCount > 0 && (
                  <button
                    onClick={() => setIsControlModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 animate-pulse"
                    title="Review incoming student payment requests"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{pendingProCount} Pro Request Pending • Grant Access</span>
                  </button>
                )}

                {/* Safe Link Share Button */}
                <button
                  onClick={() => setIsSafeShareModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1"
                  title="Copy safe user link for students with zero admin controls"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copy Safe User Link</span>
                </button>

                {/* CEO Controls */}
                <button
                  onClick={() => setIsControlModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>⚙️ CEO Controls</span>
                </button>
              </>
            ) : (
              /* Public / Student Mode Actions (Safe & Clean) */
              <>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50 hover:bg-cyan-900/40 transition-all cursor-pointer"
                  title="Open User Profile & Settings"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setIsOnboardingModalOpen(true)}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1"
                  title="Customize your goal, dream & preferred language"
                >
                  <span>🎯 Goal & Language</span>
                </button>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{(progress as any).isPremium ? 'Pro Pass Active ✓' : 'All in ₹99'}</span>
                </button>
              </>
            )}

            {/* XP Gamification Badge */}
            <div className="flex items-center gap-1 text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>+{progress.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Custom Widgets & Banners Injected from Gemini 3.8 Flash Code Applier */}
      <div id="sg-dynamic-widgets-container" className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-2 space-y-2 empty:hidden" />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {/* Sub-Studio Return Ribbon (When inside any sub-tool opened from Explore) */}
        {['codelab', 'flowai', 'chatgpt', 'webstudio', 'grok', 'bugdoctor', 'proofloop', 'maps', 'aicourse', 'playstore', 'simulators', 'forum', 'github'].includes(activeTab) && (
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 sticky top-16 z-30 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                <span>← Back to Explore Hub</span>
              </button>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[11px] uppercase tracking-wider">{activeTab} Studio Active</span>
              </div>
            </div>
          </div>
        )}

        {/* HII Mobile-First Home View */}
        {activeTab === 'home' && (
          <HiiHomeView
            progress={progress}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenUpgradeModal={() => setIsPaymentModalOpen(true)}
            isCeoAuthenticated={isCeoAuthenticated}
            onOpenOfflineModules={() => setIsOfflineModalOpen(true)}
            isOnline={isOnline}
          />
        )}

        {/* HII AI Tools Hub */}
        {activeTab === 'aitools' && (
          <HiiAIToolsHub
            progress={progress}
            onLaunchEmbeddedStudio={(tab) => {
              setActiveTab(tab as AppTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenUpgradeModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {/* HII Activity Dashboard */}
        {activeTab === 'activity' && (
          <HiiActivityView
            progress={progress}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isOnline={isOnline}
            onOpenOfflineModules={() => setIsOfflineModalOpen(true)}
          />
        )}

        {/* HII Profile View (Normal User & CEO Separation with Advanced Settings) */}
        {activeTab === 'profile' && (
          <HiiProfileView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            isCeoAuthenticated={isCeoAuthenticated}
            onCeoAuthenticated={(token) => {
              setIsCeoAuthenticated(true);
              setIsUserMode(false);
            }}
            onCeoLogout={() => {
              setIsCeoAuthenticated(false);
              setIsUserMode(true);
              sessionStorage.removeItem('sg_ceo_pin_verified');
            }}
            onOpenCeoDashboard={() => setIsControlModalOpen(true)}
            onOpenUpgradeModal={() => setIsPaymentModalOpen(true)}
            onOpenOfflineModules={() => setIsOfflineModalOpen(true)}
            isOnline={isOnline}
          />
        )}

        {/* Google Workspace Hub (Google Drive & Gmail 1P APIs) */}
        {activeTab === 'workspace' && (
          <GoogleWorkspaceHub
            progress={progress}
            onOpenCodeLab={handleJumpToCodeLabWithCode}
          />
        )}

        {/* Explore Hub (Unified App-Like Dashboard) */}
        {activeTab === 'explore' && (
          <ExploreHub
            progress={progress}
            onSelectFeature={(featureId) => {
              if (featureId === 'video-editing') {
                setActiveTab('courses');
              } else {
                setActiveTab(featureId as AppTab);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {/* YouTube Video Academy with Curated Creator Masterclasses */}
        {activeTab === 'courses' && (
          <VideoCoursesHub
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
            onAskInAIView={handleAskTopic}
            onOpenProofLoop={() => {
              setActiveTab('proofloop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            isOnline={isOnline}
            onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
          />
        )}

        {/* Flow AI Prompt-to-Video Studio (10s Clips & Export) */}
        {activeTab === 'flowai' && (
          <FlowAIVideoStudio
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {/* ChatGPT GPTs Studio & Custom GPT Store */}
        {activeTab === 'chatgpt' && (
          <ChatGPTStudio
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
          />
        )}

        {/* AI Web Dev Studio (like aistudio.google with Live Sandbox) */}
        {activeTab === 'webstudio' && (
          <WebDevStudio
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {/* Grok AI Studio (Think Mode & Unhinged Reasoning) */}
        {activeTab === 'grok' && (
          <GrokAIStudio
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {activeTab === 'graph' && (
          <SkillGraphView
            progress={progress}
            onSelectSkillForExercise={handleSelectSkillForExercise}
            onAskTopic={handleAskTopic}
            onUpdateProgress={handleUpdateProgress}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {activeTab === 'aicourse' && (
          <AICourseView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
            onOpenProofLoop={() => {
              setActiveTab('proofloop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'proofloop' && (
          <ProofLoopView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            languageTone={languageTone}
            onOpenGitHubHub={handleOpenGitHubHub}
          />
        )}

        {activeTab === 'bugdoctor' && (
          <BugDoctorView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            languageTone={languageTone}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
          />
        )}

        {activeTab === 'codelab' && (
          <CodeLabView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            languageTone={languageTone}
            initialExerciseId={selectedExerciseId}
            injectedCode={injectedCode}
          />
        )}

        {activeTab === 'maps' && (
          <GoogleMapsLabView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            languageTone={languageTone}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
          />
        )}

        {activeTab === 'ask' && (
          <AskAIView
            languageTone={languageTone}
            setLanguageTone={setLanguageTone}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            initialQuestion={askQuestionQuery}
            onJumpToCodeLab={handleJumpToCodeLabWithCode}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {activeTab === 'forum' && (
          <ForumView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            languageTone={languageTone}
            onAskInAIView={handleAskTopic}
          />
        )}

        {activeTab === 'github' && (
          <GitHubHubView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            exportedProjectData={exportedGitHubData}
          />
        )}

        {activeTab === 'simulators' && <VisualSimulatorsView />}

        {activeTab === 'playstore' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <PlayStoreLaunchKit onClose={() => setActiveTab('graph')} />
          </div>
        )}
      </main>

      {/* ₹99 All-Access Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
      />

      {/* Persistent Gemini Chatbot Floating Widget */}
      <GeminiChatbot
        languageTone={languageTone}
        progress={progress}
        onJumpToCodeLab={handleJumpToCodeLabWithCode}
        onOpenProofLoop={() => {
          setActiveTab('proofloop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Administrative App Controls Modal (Strictly Quarantined to Verified CEO Session) */}
      {isCeoAuthenticated && (
        <AppControlModal
          isOpen={isControlModalOpen}
          onClose={() => setIsControlModalOpen(false)}
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          languageTone={languageTone}
          setLanguageTone={setLanguageTone}
          onOpenSafeShare={() => setIsSafeShareModalOpen(true)}
        />
      )}

      {/* Safe User Share Link Modal */}
      <SafeShareModal
        isOpen={isSafeShareModalOpen}
        onClose={() => setIsSafeShareModalOpen(false)}
      />

      {/* Founder & CEO 4-Digit PIN (9134) Auth Modal */}
      <FounderAuthModal
        isOpen={isFounderAuthModalOpen}
        onClose={() => setIsFounderAuthModalOpen(false)}
        onSuccess={() => {
          setIsCeoAuthenticated(true);
          setIsUserMode(false);
          sessionStorage.setItem('sg_ceo_pin_verified', 'true');
        }}
      />

      {/* User & CEO Profile Modal */}
      <UserOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={(profile) => {
          console.log('User Profile Saved:', profile);
        }}
        onUpdateProgress={handleUpdateProgress}
        progress={progress}
        setLanguageTone={setLanguageTone}
        isCeoAuthenticated={isCeoAuthenticated}
        onOpenControls={() => setIsControlModalOpen(true)}
        onLockCeoMode={() => {
          setIsCeoAuthenticated(false);
          setIsUserMode(true);
          sessionStorage.removeItem('sg_ceo_pin_verified');
          localStorage.removeItem('sg_ceo_pin_verified');
          localStorage.removeItem('sg_ceo_auth');
        }}
        onUnlockCeoMode={() => {
          setIsCeoAuthenticated(true);
          setIsUserMode(false);
          sessionStorage.setItem('sg_ceo_pin_verified', 'true');
          setIsControlModalOpen(true);
        }}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectStudio={(tab) => {
          setActiveTab(tab as AppTab);
        }}
        onSelectExercise={(exerciseId) => {
          setSelectedExerciseId(exerciseId);
          setActiveTab('codelab');
        }}
        onTriggerAI={(q, tool) => {
          if (tool === 'ask') {
            setAskQuestionQuery(q);
            setActiveTab('ask');
          } else if (tool === 'bugdoctor') {
            setInjectedCode(`// User submitted bug query via Command Palette:\n// ${q}\n\nfunction solveProblem() {\n  // Type code here\n}`);
            setActiveTab('bugdoctor');
          } else if (tool === 'grok') {
            setActiveTab('grok');
          } else if (tool === 'flowai') {
            setActiveTab('flowai');
          }
        }}
        onOpenProfile={() => setIsOnboardingModalOpen(true)}
        isCeoAuthenticated={isCeoAuthenticated}
        onOpenOfflineModules={() => setIsOfflineModalOpen(true)}
      />

      {/* Daily Learning Streak Counter & Motivation Modal */}
      <StreakMotivationModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        progress={progress}
        onContinueLearning={() => {
          setActiveTab('courses');
        }}
      />

      {/* Offline Indicator Floating Pill & Connectivity Banners */}
      <OfflineIndicator
        onOpenOfflineModules={() => setIsOfflineModalOpen(true)}
        cachedModulesCount={progress.completedVideoLessons?.length}
      />

      {/* Offline Completed Modules Viewer & Study Modal */}
      <OfflineModulesModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        progress={progress}
        onOpenCodeLab={handleJumpToCodeLabWithCode}
        isOnline={isOnline}
      />

      {/* Clean Mobile/Web App Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="font-extrabold text-sm text-white flex items-center justify-center md:justify-start gap-2">
              <span>Skill</span>
              <span className="text-indigo-400">Graph</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono">
                ProofLoop™
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                Interactive Learning Edition
              </span>
            </div>
            <p className="text-slate-500 max-w-md">
              Democratizing Coding, Artificial Intelligence, and Systems Engineering for all learners through physical real-life analogies and verifiable proof of work.
            </p>
          </div>

          {/* Quick Curriculum Jump Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={() => {
                setActiveTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-red-300 transition-colors font-medium"
            >
              Courses
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('codelab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-300 transition-colors font-medium"
            >
              Code Lab
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('graph');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-indigo-300 transition-colors font-medium"
            >
              Skill Graph
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('ask');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-400 hover:text-amber-300 transition-colors font-bold"
            >
              Ask AI Teacher
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors font-bold"
            >
              Explore Studios
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
