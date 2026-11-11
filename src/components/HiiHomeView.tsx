import React from 'react';
import { 
  Sparkles, 
  Video, 
  Brain, 
  Film, 
  Activity, 
  Flame, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  Code2, 
  Award, 
  Sliders, 
  FolderGit2, 
  Mail, 
  Crown,
  ChevronRight,
  TrendingUp,
  Wand2,
  WifiOff,
  BookOpen
} from 'lucide-react';
import { UserProgress } from '../types';
import { getStreakMotivationalQuote } from '../utils/streakManager';

interface HiiHomeViewProps {
  progress: UserProgress;
  onNavigateTab: (tab: any) => void;
  onOpenUpgradeModal: () => void;
  isCeoAuthenticated: boolean;
  onOpenOfflineModules?: () => void;
  isOnline?: boolean;
}

export const HiiHomeView: React.FC<HiiHomeViewProps> = ({
  progress,
  onNavigateTab,
  onOpenUpgradeModal,
  isCeoAuthenticated,
  onOpenOfflineModules,
  isOnline = true,
}) => {
  const quote = getStreakMotivationalQuote(progress.streak);
  const isPremium = (progress as any).isPremium;
  const currentPlan = (progress as any).proPlanTier || (isPremium ? 'PRO' : 'FREE');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-6 pb-24 animate-fadeIn">
      {/* Mobile-First Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>SkillGraph AI Super App</span>
              </span>
              <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                CEO: Ansh Kumar
              </span>
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {currentPlan} PLAN
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Master Modern AI, Code & Creator Tools
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              5-Stage ProofLoop™ methodology with Indian creator masterclasses, embedded AI studios, and physical real-life analogies.
            </p>
          </div>

          {/* Quick Stats Pill Row */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-sm">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{progress.streak}d</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Streak</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-sm">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span>{progress.xp}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-cyan-400 font-black text-sm">
                <Award className="w-4 h-4" />
                <span>{progress.completedExercises?.length || 0}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Quote Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
        <Flame className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0 animate-pulse" />
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">Daily Motivation</span>
          <p className="text-xs text-amber-200 font-medium truncate">{quote}</p>
        </div>
      </div>

      {/* Offline Mode Active Quick Launcher */}
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <WifiOff className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-black text-amber-300 text-sm">
                Offline Mode Active
              </h4>
              <p className="text-slate-300 text-xs">
                Connection lost. Your completed modules and practice exercises are cached and available for offline study.
              </p>
            </div>
          </div>
          {onOpenOfflineModules && (
            <button
              onClick={onOpenOfflineModules}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Cached Modules</span>
            </button>
          )}
        </div>
      )}

      {/* Primary 4 Quick Navigation Cards */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-300 px-1">Featured Studios</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Courses */}
          <div
            onClick={() => onNavigateTab('courses')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/40 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                Creator Courses
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Chai aur Code & Harry masterclasses
              </p>
            </div>
          </div>

          {/* AI Tools */}
          <div
            onClick={() => onNavigateTab('aitools')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                AI Tools Hub
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Gemini, GPT, Grok & Flow AI
              </p>
            </div>
          </div>

          {/* Code Lab */}
          <div
            onClick={() => onNavigateTab('codelab')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Code Lab Sandbox
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                JavaScript & Python tests
              </p>
            </div>
          </div>

          {/* Activity */}
          <div
            onClick={() => onNavigateTab('activity')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Activity Graph
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Daily learning logs & analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Workspace Integration Banner */}
      <div 
        onClick={() => onNavigateTab('workspace')}
        className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-all shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span>Google Drive & Gmail Connected</span>
              <span className="text-[9px] px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">1P</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Save code solutions directly to Drive or send study reports via Gmail
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* Subscription Banner */}
      {!isPremium && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Upgrade to HII Pro or Advanced</span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.2 rounded-full font-bold">
                From ₹99/mo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Unlock unlimited AI Teacher queries, premium video editing effects, and full ProofLoop masterclasses.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 cursor-pointer text-center"
          >
            Upgrade Plan →
          </button>
        </div>
      )}
    </div>
  );
};
