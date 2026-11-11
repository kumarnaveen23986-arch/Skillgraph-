import React from 'react';
import { Flame, X, Trophy, Sparkles, CheckCircle2, ArrowRight, Zap, Award, Calendar } from 'lucide-react';
import { UserProgress } from '../types';
import { getStreakMotivationalQuote, getStreakMilestone, getTodayDateString } from '../utils/streakManager';

interface StreakMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onContinueLearning: () => void;
}

export const StreakMotivationModal: React.FC<StreakMotivationModalProps> = ({
  isOpen,
  onClose,
  progress,
  onContinueLearning,
}) => {
  if (!isOpen) return null;

  const streak = progress.streak || 1;
  const quote = getStreakMotivationalQuote(streak);
  const milestone = getStreakMilestone(streak);
  const today = getTodayDateString();
  const isCompletedToday = (progress as any).lastStreakIncrementDate === today || progress.lastActiveDate === today;

  const MILESTONES = [
    { day: 1, label: 'Ignition', badge: '🔥' },
    { day: 3, label: 'Habit Locked', badge: '⚡' },
    { day: 7, label: 'Weekly Legend', badge: '🏆' },
    { day: 14, label: 'Titan', badge: '👑' },
    { day: 30, label: 'Grandmaster', badge: '🌌' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Animated Flame & Streak Counter */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Flame className="w-10 h-10 text-amber-400 fill-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
              ACTIVE
            </div>
          </div>

          <div>
            <div className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>{streak}</span>
              <span className="text-xl text-amber-400 font-extrabold">Day Streak!</span>
            </div>
            <p className="text-xs text-amber-300 font-semibold mt-1">
              {isCompletedToday ? '✓ Lesson Completed Today! Streak Preserved.' : '⏳ Complete a lesson today to ignite tomorrow!'}
            </p>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-orange-500/15 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Daily Motivation</span>
          </div>
          <p className="text-sm font-bold text-white leading-snug">
            "{quote}"
          </p>
          <p className="text-[11px] text-slate-400 italic">
            — SkillGraph ProofLoop™ Mastery Principle
          </p>
        </div>

        {/* Milestones Road */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Milestone: Day {milestone.nextGoal}</span>
            </span>
            <span className="text-amber-400 font-mono font-bold">{milestone.progressPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, milestone.progressPercent)}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1 text-center">
            {MILESTONES.map((m) => {
              const reached = streak >= m.day;
              return (
                <div
                  key={m.day}
                  className={`p-2 rounded-xl border transition-all ${
                    reached
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-base">{m.badge}</div>
                  <div className="text-[10px] font-mono mt-0.5">{m.day}d</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onContinueLearning();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
        >
          <span>Continue Daily Coding Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
