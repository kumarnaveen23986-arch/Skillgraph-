import React from 'react';
import { 
  Network, 
  Lightbulb, 
  Code2, 
  Sliders, 
  Flame, 
  Zap, 
  Languages, 
  MessageSquare, 
  Stethoscope, 
  Sparkles, 
  RotateCw, 
  Github, 
  Globe2,
  Smartphone,
  Award,
  Video,
  Film,
  Globe,
  Brain,
  Lock,
  Bot,
  Compass,
  User,
  Crown,
  Search,
  Home,
  Activity,
  FolderGit2,
  WifiOff
} from 'lucide-react';
import { LanguageTone, UserProgress } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { getStreakMotivationalQuote } from '../utils/streakManager';

export type AppTab = 
  | 'home'
  | 'courses'
  | 'aitools'
  | 'activity'
  | 'profile'
  | 'workspace'
  | 'explore'
  | 'codelab'
  | 'graph' 
  | 'ask' 
  | 'flowai'
  | 'chatgpt'
  | 'webstudio'
  | 'grok'
  | 'aicourse'
  | 'proofloop' 
  | 'bugdoctor' 
  | 'maps' 
  | 'forum' 
  | 'github' 
  | 'simulators'
  | 'playstore';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  languageTone: LanguageTone;
  setLanguageTone: (tone: LanguageTone) => void;
  progress: UserProgress;
  onOpenQuickAsk: () => void;
  onOpenControls?: () => void;
  onOpenPaymentModal?: () => void;
  onOpenProfile?: () => void;
  isUserMode?: boolean;
  onToggleUserMode?: () => void;
  isCeoAuthenticated?: boolean;
  onOpenFounderAuth?: () => void;
  onOpenSafeShare?: () => void;
  pendingProCount?: number;
  onOpenCommandPalette?: () => void;
  onOpenStreakModal?: () => void;
  isOnline?: boolean;
  onOpenOfflineModules?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  languageTone,
  setLanguageTone,
  progress,
  onOpenQuickAsk,
  onOpenControls,
  onOpenPaymentModal,
  onOpenProfile,
  isUserMode = false,
  onToggleUserMode,
  isCeoAuthenticated = false,
  onOpenFounderAuth,
  onOpenSafeShare,
  pendingProCount = 0,
  onOpenCommandPalette,
  onOpenStreakModal,
  isOnline = true,
  onOpenOfflineModules,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-cyan-300 text-xs tracking-wider">
                SG
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Skill<span className="text-indigo-400 font-bold ml-0.5">Graph</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 hidden xs:inline-block">
                  CEO: Ansh Kumar
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden xl:block">
                Modern AI, Creator & Engineering Super Platform
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Top Fast Nav: Graph & Profile added at top together */}
        <div className="flex md:hidden items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner shrink-0">
          {/* Skill Graph */}
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'graph'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-300 hover:text-white'
            }`}
            title="Skill Graph"
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>Graph</span>
          </button>

          {/* Profile right next to Graph */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? isCeoAuthenticated
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-sm'
                  : 'bg-cyan-600 text-white shadow-sm'
                : isCeoAuthenticated
                ? 'text-amber-300 hover:text-white'
                : 'text-cyan-300 hover:text-white'
            }`}
            title="User Profile & Settings"
          >
            {isCeoAuthenticated ? (
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{isCeoAuthenticated ? 'CEO' : 'Profile'}</span>
          </button>
        </div>

        {/* Center Navigation Tabs (Desktop - Streamlined with Graph & Profile together) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 shadow-inner">
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-indigo-400" />
            <span>Home</span>
          </button>

          {/* 2. Courses */}
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-400" />
            <span>Courses</span>
          </button>

          {/* 3. AI Tools */}
          <button
            onClick={() => setActiveTab('aitools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'aitools'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Tools</span>
          </button>

          {/* 4. Activity */}
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Activity</span>
          </button>

          {/* 5. Skill Graph */}
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'graph'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>Skill Graph</span>
          </button>

          {/* 6. Profile (Positioned right alongside Graph!) */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? isCeoAuthenticated
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-cyan-600 text-white shadow-md font-bold'
                : isCeoAuthenticated
                ? 'text-amber-300 hover:text-white hover:bg-slate-800/60 font-bold'
                : 'text-cyan-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {isCeoAuthenticated ? (
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{isCeoAuthenticated ? 'CEO Profile' : 'Profile'}</span>
          </button>

          {/* 7. Explore Studios */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'explore' ||
              ['codelab', 'flowai', 'chatgpt', 'grok', 'webstudio', 'bugdoctor', 'proofloop', 'maps', 'aicourse', 'playstore', 'workspace'].includes(activeTab)
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Explore</span>
          </button>
        </nav>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ₹99 Pro Pass Button */}
          {onOpenPaymentModal && (
            <button
              onClick={onOpenPaymentModal}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                (progress as any).isPremium
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 animate-pulse'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{(progress as any).isPremium ? 'PRO PASS ✓' : 'ALL IN ₹99'}</span>
            </button>
          )}

          {/* CEO Mode Switcher & Controls (Only visible to verified CEO Ansh Kumar) */}
          {isCeoAuthenticated ? (
            <div className="flex items-center gap-1.5">
              {/* Copy Safe User Link Button */}
              {onOpenSafeShare && (
                <button
                  onClick={onOpenSafeShare}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all"
                  title="Share safe link with users (Zero admin access)"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Safe User Link</span>
                </button>
              )}

              {/* User vs CEO Preview Switcher */}
              {onToggleUserMode && (
                <button
                  onClick={onToggleUserMode}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                    isUserMode
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/40'
                      : 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/40'
                  }`}
                  title={isUserMode ? "Previewing as Student (Switch to CEO View)" : "Master View (Switch to Preview)"}
                >
                  <span>{isUserMode ? '📱 User View' : '👑 CEO View'}</span>
                </button>
              )}

              {/* CEO Controls with Real-time Pending Approvals Badge */}
              {onOpenControls && (
                <button
                  onClick={onOpenControls}
                  className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all"
                  title="CEO Control Center & Approvals Desk"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CEO Controls</span>
                  {pendingProCount > 0 && (
                    <span className="flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-black bg-amber-500 text-slate-950 rounded-full animate-bounce">
                      {pendingProCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          ) : null}

          {/* Search / Command Palette Shortcut Button (Ctrl+K) */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-inner"
              title="Quick Jump & Search Studios, Lessons, or AI (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 rounded border border-slate-800">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Offline Mode Indicator Badge */}
          {!isOnline && (
            <button
              onClick={onOpenOfflineModules}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition shadow-sm cursor-pointer animate-pulse"
              title="You are offline. Click to view cached completed modules."
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline</span>
            </button>
          )}

          {/* In-App PWA Install Button */}
          <PWAInstallButton 
            variant="navbar" 
            onOpenPlayStoreKit={() => setActiveTab('playstore')} 
          />

          {/* Gamification Stats */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
            {/* Daily Learning Streak with Motivational Message */}
            <div 
              onClick={() => onOpenStreakModal && onOpenStreakModal()}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer group shadow-sm"
              title={`${progress.streak} Day Learning Streak! Click to view daily milestones & motivation.`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span>{progress.streak}d</span>
              <span className="hidden xl:inline text-[11px] text-amber-200/90 font-medium border-l border-amber-500/30 pl-1.5 truncate max-w-[170px]">
                {getStreakMotivationalQuote(progress.streak).split('!')[0]}!
              </span>
            </div>

            {/* XP */}
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold"
              title={`${progress.xp} Total XP earned`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>{progress.xp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar - Core Learning Tabs (PROFILE COMPLETELY REMOVED FROM BOTTOM) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/95 px-1 py-2 gap-1 shadow-2xl">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
          }`}
        >
          <Home className="w-4 h-4 text-indigo-400" />
          <span>Home</span>
        </button>

        {/* 2. Courses */}
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${
            activeTab === 'courses' ? 'text-red-400 bg-red-500/10' : 'text-slate-400'
          }`}
        >
          <Video className="w-4 h-4 text-red-400" />
          <span>Courses</span>
        </button>

        {/* 3. AI Tools */}
        <button
          onClick={() => setActiveTab('aitools')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${
            activeTab === 'aitools' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          <Brain className="w-4 h-4 text-amber-400" />
          <span>AI Tools</span>
        </button>

        {/* 4. Activity */}
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${
            activeTab === 'activity' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Activity</span>
        </button>

        {/* 5. Explore Studios */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${
            activeTab === 'explore' ||
            ['codelab', 'flowai', 'chatgpt', 'grok', 'webstudio', 'bugdoctor', 'proofloop', 'maps', 'aicourse', 'playstore', 'workspace'].includes(activeTab)
              ? 'text-purple-400 bg-purple-500/10 font-black'
              : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4 text-purple-400" />
          <span>Explore</span>
        </button>
      </div>
    </header>
  );
};
