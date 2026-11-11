import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  BookOpen, 
  Code2, 
  ArrowRight, 
  Layers, 
  Compass, 
  Cpu, 
  Clock, 
  Network, 
  TrendingUp, 
  Search, 
  Activity, 
  Target, 
  FileText,
  X,
  Play,
  RotateCw,
  GitFork,
  Box,
  Sliders,
  Zap,
  Flame,
  Calendar,
  BarChart3,
  ShieldAlert,
  Award,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { CURATED_SKILLS, TRACK_METADATA } from '../data/curatedSkills';
import { DifficultyLevel, SkillNode, TrackCategory, UserProgress } from '../types';

interface SkillGraphViewProps {
  progress: UserProgress;
  onSelectSkillForExercise: (exerciseId: string) => void;
  onAskTopic: (topicTitle: string) => void;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onOpenPaymentModal?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Box,
  GitFork,
  RotateCw,
  Cpu,
  Clock,
  Network,
  Sliders,
  TrendingUp,
  Search,
  Layers,
  Compass,
  Activity,
  Target,
  FileText,
  Sparkles,
  BookOpen,
};

export const SkillGraphView: React.FC<SkillGraphViewProps> = ({
  progress,
  onSelectSkillForExercise,
  onAskTopic,
  onUpdateProgress,
  onOpenPaymentModal,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'skills' | 'activity'>('skills');
  const [selectedTrack, setSelectedTrack] = useState<TrackCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [activeModalSkill, setActiveModalSkill] = useState<SkillNode | null>(null);

  const filteredSkills = CURATED_SKILLS.filter((skill) => {
    if (selectedTrack !== 'all' && skill.track !== selectedTrack) return false;
    if (selectedDifficulty !== 'all' && skill.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const isMastered = (skillId: string) => progress.masteredSkills.includes(skillId);

  const toggleMastered = (skillId: string) => {
    const already = progress.masteredSkills.includes(skillId);
    let updatedMastered: string[];
    let xpGain = 0;

    if (already) {
      updatedMastered = progress.masteredSkills.filter((id) => id !== skillId);
    } else {
      updatedMastered = [...progress.masteredSkills, skillId];
      xpGain = 30;
    }

    onUpdateProgress({
      ...progress,
      masteredSkills: updatedMastered,
      xp: progress.xp + xpGain,
    });
  };

  const isPro = Boolean(progress.isPremium);
  const plan = progress.subscriptionPlan || (isPro ? 'pro_99' : 'free');
  const dailyQueriesUsed = progress.dailyAiQueriesUsed || 0;
  const queriesRemaining = Math.max(0, 5 - dailyQueriesUsed);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* View Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTabMode('skills')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTabMode === 'skills'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Visual Dependency Tree</span>
          </button>

          <button
            onClick={() => setActiveTabMode('activity')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTabMode === 'activity'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-300" />
            <span>Activity Graph & Velocity</span>
            {!isPro && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {queriesRemaining}/5 AI
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-end px-2">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <strong className="text-white">{progress.streak} Day Streak</strong>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <strong className="text-white">{progress.xp} XP</strong>
          </span>
        </div>
      </div>
      {activeTabMode === 'activity' ? (
        /* ================= ACTIVITY GRAPH & LEARNING TRAJECTORY ================= */
        <div className="space-y-8 animate-fadeIn">
          {/* Activity Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-900/40 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mb-20"></div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Learning Analytics & Activity Graph</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Your Learning Trajectory &{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Skill Velocity
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Inspect your weekly momentum, daily AI Personal Teacher quota limits, concept completion milestones, and verifiable proof of work.
              </p>
            </div>
          </div>

          {/* 4 Core Metric Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Panel 1: Subscription Tier & XP Cap */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">Subscription Tier</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isPro 
                    ? plan === 'advanced_299' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {plan === 'advanced_299' ? 'VIP ₹299' : isPro ? 'Pro ₹99' : 'Free Learner'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white">
                  {progress.xp} <span className="text-xs font-normal text-slate-400">XP</span>
                </div>
                <div className="text-xs text-slate-400">
                  {plan === 'advanced_299' 
                    ? '⚡ Unlimited XP (Zero Limit)' 
                    : isPro 
                    ? 'Pro Cap: 2,500 XP Max' 
                    : 'Free Bonus: 100 XP initial grant'}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 mt-3">
                {!isPro ? (
                  <button
                    onClick={onOpenPaymentModal}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>Upgrade Plan (₹99 / ₹299)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active {plan === 'advanced_299' ? 'VIP Pass' : 'Pro Pass'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Panel 2: AI Teacher Daily Quota */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">AI Teacher Quota</span>
                <span className="text-amber-400 font-bold text-xs">
                  {isPro ? 'Unlimited' : `${queriesRemaining}/5 Left`}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-2xl font-black text-white">
                  {isPro ? '∞' : queriesRemaining}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    {isPro ? 'Queries Allowed' : 'Queries Today'}
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${
                      isPro 
                        ? 'bg-emerald-400 w-full' 
                        : queriesRemaining > 2 
                        ? 'bg-indigo-500' 
                        : 'bg-rose-500'
                    }`}
                    style={{ width: isPro ? '100%' : `${(queriesRemaining / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {isPro ? 'Gemini Pro Enabled' : 'Resets at Midnight'}
                </span>
                {!isPro && (
                  <button
                    onClick={onOpenPaymentModal}
                    className="text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    Get Unlimited
                  </button>
                )}
              </div>
            </div>

            {/* Panel 3: Concepts Mastered */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">Concept Mastery</span>
                <Target className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-1.5">
                <div className="text-2xl font-black text-white">
                  {progress.masteredSkills.length} <span className="text-xs font-normal text-slate-400">/ {CURATED_SKILLS.length}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.masteredSkills.length / CURATED_SKILLS.length) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 mt-3 text-xs text-slate-400">
                {Math.round((progress.masteredSkills.length / CURATED_SKILLS.length) * 100)}% Curriculum Finished
              </div>
            </div>

            {/* Panel 4: Active Day Streak */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">Daily Streak</span>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white">
                  {progress.streak} <span className="text-xs font-normal text-slate-400">Days</span>
                </div>
                <div className="text-xs text-slate-400">
                  Consistency status: On Fire 🔥
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Last active: Today</span>
              </div>
            </div>
          </div>

          {/* 7-Day Velocity Chart & Domain Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-Day Activity Velocity Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>7-Day Activity & XP Velocity</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daily engagement breakdown across coding, video lessons, and AI queries
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  This Week
                </span>
              </div>

              {/* Visual Bar Chart */}
              <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-800 pb-3">
                {[
                  { day: 'Mon', xp: 40, height: '40%', active: false },
                  { day: 'Tue', xp: 60, height: '60%', active: false },
                  { day: 'Wed', xp: 30, height: '30%', active: false },
                  { day: 'Thu', xp: 85, height: '85%', active: false },
                  { day: 'Fri', xp: 50, height: '50%', active: false },
                  { day: 'Sat', xp: 100, height: '100%', active: true },
                  { day: 'Sun', xp: 75, height: '75%', active: false },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-300 transition-colors opacity-0 group-hover:opacity-100">
                      +{col.xp} XP
                    </span>
                    <div
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 group-hover:brightness-125 ${
                        col.active
                          ? 'bg-gradient-to-t from-emerald-600 to-cyan-400 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}
                      style={{ height: col.height }}
                    />
                    <span className={`text-xs font-medium ${col.active ? 'text-white font-bold' : 'text-slate-400'}`}>
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"></span>
                    <span>Active Session Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span>Past Activity</span>
                  </div>
                </div>
                <span className="text-slate-500">Updated in real-time</span>
              </div>
            </div>

            {/* Curriculum Progress Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Domain Mastery</span>
              </h3>

              <div className="space-y-4">
                {[
                  { name: 'Python Fundamentals', progress: 85, color: 'from-amber-500 to-orange-500' },
                  { name: 'JavaScript & Web', progress: 60, color: 'from-indigo-500 to-cyan-400' },
                  { name: 'AI & Neural Networks', progress: 45, color: 'from-purple-500 to-pink-500' },
                  { name: 'Video Editing & VFX (VIP)', progress: isPro ? 70 : 15, color: 'from-emerald-500 to-teal-400' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="font-mono text-slate-400">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveTabMode('skills')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Skill Nodes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Verified Activity Stream</span>
              </h3>
              <span className="text-xs text-slate-500">Live Timestamped Log</span>
            </div>

            <div className="space-y-3">
              {(progress.activityLog && progress.activityLog.length > 0
                ? progress.activityLog
                : [
                    {
                      id: '1',
                      date: new Date().toISOString().split('T')[0],
                      timestamp: 'Just now',
                      action: 'Account Created & 100 XP New User Welcome Bonus Claimed',
                      xpGained: 100,
                      category: 'ai' as const,
                    },
                    {
                      id: '2',
                      date: new Date().toISOString().split('T')[0],
                      timestamp: '1 hour ago',
                      action: 'Mastered Variables & Data Types Concept in Skill Tree',
                      xpGained: 30,
                      category: 'code' as const,
                    },
                    {
                      id: '3',
                      date: new Date().toISOString().split('T')[0],
                      timestamp: 'Yesterday',
                      action: 'Explored Video Courses Hub: Chai aur Code Python Series',
                      xpGained: 15,
                      category: 'video' as const,
                    },
                  ]
              ).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      {act.category === 'code' ? (
                        <Code2 className="w-4 h-4" />
                      ) : act.category === 'video' ? (
                        <Play className="w-4 h-4" />
                      ) : act.category === 'flowai' ? (
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Zap className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{act.action}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{act.timestamp}</div>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    +{act.xpGained} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ================= VISUAL SKILL DEPENDENCY TREE ================= */
        <>
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mb-20"></div>

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Visual Dependency Skill Tree</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Learn Coding & AI through{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Real-Life Analogies
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Every complex concept has a physical counterpart in everyday life—from kitchen recipes and elevator doors to dartboard coaches and open-book exams. Click any node to reveal its story, code snippet, and hands-on practice.
              </p>

              {/* Quick Mastery Stat */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>{progress.masteredSkills.length} of {CURATED_SKILLS.length} Concepts Mastered</span>
                </div>

                <div className="text-xs text-slate-400">
                  💡 Tip: Click on any concept to read its story or practice in the Code Lab!
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
            {/* Track Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedTrack === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                All Tracks ({CURATED_SKILLS.length})
              </button>
              {TRACK_METADATA.map((track) => {
                const count = CURATED_SKILLS.filter((s) => s.track === track.id).length;
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id as TrackCategory)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedTrack === track.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {track.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <span className="text-xs text-slate-500 font-medium mr-1 hidden sm:inline">Level:</span>
              {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff === 'all' ? 'All Levels' : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Tracks & Concept Cards */}
          <div className="space-y-10">
            {TRACK_METADATA.filter(
              (track) => selectedTrack === 'all' || selectedTrack === track.id
            ).map((track) => {
              const trackSkills = filteredSkills.filter((s) => s.track === track.id);
              if (trackSkills.length === 0) return null;

              return (
                <div key={track.id} className="space-y-4">
                  {/* Track Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${track.color}`}></div>
                      <h2 className="text-lg font-bold text-white tracking-wide">{track.name}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${track.bgBadge}`}>
                        {trackSkills.length} Concepts
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 hidden sm:block max-w-md text-right">
                      {track.description}
                    </p>
                  </div>

                  {/* Grid of Concept Nodes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trackSkills.map((skill) => {
                      const mastered = isMastered(skill.id);
                      const Icon = ICON_MAP[skill.iconName] || BookOpen;

                      return (
                        <div
                          key={skill.id}
                          onClick={() => setActiveModalSkill(skill)}
                          className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            mastered
                              ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/20'
                              : 'bg-slate-900/60 border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-950/20'
                          }`}
                        >
                          {/* Top Row: Icon + Difficulty + Mastery Badge */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                  mastered
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-cyan-300'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                                  {skill.title}
                                </h3>
                                <span
                                  className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    skill.difficulty === 'Beginner'
                                      ? 'bg-emerald-500/10 text-emerald-400'
                                      : skill.difficulty === 'Intermediate'
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : 'bg-rose-500/10 text-rose-400'
                                  }`}
                                >
                                  {skill.difficulty}
                                </span>
                              </div>
                            </div>

                            {/* Mastery status toggle button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMastered(skill.id);
                              }}
                              className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
                              title={mastered ? 'Mastered! Click to unmark' : 'Click to mark as mastered'}
                            >
                              {mastered ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Real Life Analogy Teaser */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400/90">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Metaphor: {skill.realLifeAnalogy.metaphorItem}</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {skill.realLifeAnalogy.story}
                            </p>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            {skill.relatedExerciseId ? (
                              <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Interactive Lab Available</span>
                              </span>
                            ) : (
                              <span className="text-slate-500">Core Mental Model</span>
                            )}

                            <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform font-semibold flex items-center gap-0.5">
                              <span>Explore</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Skill Detail Slide-Over Modal */}
      {activeModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      activeModalSkill.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : activeModalSkill.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {activeModalSkill.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {TRACK_METADATA.find((t) => t.id === activeModalSkill.track)?.name}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  {activeModalSkill.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {activeModalSkill.shortTagline}
                </p>
              </div>

              <button
                onClick={() => setActiveModalSkill(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Real Life Analogy Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>The Real-Life Analogy: {activeModalSkill.realLifeAnalogy.title}</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {activeModalSkill.realLifeAnalogy.story}
              </p>
            </div>

            {/* Core Takeaway */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed font-medium">
              💡 <span className="font-bold text-white">Core Insight: </span>
              {activeModalSkill.keyTakeaway}
            </div>

            {/* Code Snippet in Action */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Code Representation:</span>
                <span className="font-mono text-[11px] text-slate-500">JavaScript</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono overflow-x-auto leading-relaxed">
                <code>{activeModalSkill.codeSnippet}</code>
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  toggleMastered(activeModalSkill.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isMastered(activeModalSkill.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isMastered(activeModalSkill.id) ? 'Mastered! (+30 XP)' : 'Mark as Mastered (+30 XP)'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const topic = activeModalSkill.title;
                    setActiveModalSkill(null);
                    onAskTopic(topic);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Ask AI Deeper</span>
                </button>

                {activeModalSkill.relatedExerciseId && (
                  <button
                    onClick={() => {
                      const exId = activeModalSkill.relatedExerciseId!;
                      setActiveModalSkill(null);
                      onSelectSkillForExercise(exId);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Practice in Code Lab</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
