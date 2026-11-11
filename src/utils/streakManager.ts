import { UserProgress } from '../types';

export interface StreakCelebration {
  streak: number;
  message: string;
  isIncreased: boolean;
  timestamp: number;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreakMotivationalQuote(streak: number): string {
  if (streak <= 1) {
    return 'Day 1 Ignited! 🔥 Every coding master once started with a single line of code.';
  }
  if (streak === 2) {
    return '2-Day Streak! ⚡ Momentum is building. Keep the coding flame alive!';
  }
  if (streak === 3) {
    return '3-Day Streak! 🚀 Habit formed! You are learning faster than 90% of students.';
  }
  if (streak === 4) {
    return '4-Day Streak! 💡 Mental models locked in. Code logic is becoming second nature!';
  }
  if (streak === 5) {
    return '5-Day Streak! 🌟 High-velocity learner! ProofLoop Champion in action.';
  }
  if (streak === 6) {
    return '6-Day Streak! 🎯 One day away from a full week of unbroken coding mastery.';
  }
  if (streak >= 7 && streak < 14) {
    return `${streak}-Day Legend! 🏆 A full week of unbroken focus! Ansh Kumar verified.`;
  }
  if (streak >= 14 && streak < 30) {
    return `${streak}-Day Code Titan! 👑 Two full weeks of elite consistency!`;
  }
  return `${streak}-Day Grandmaster! 🌌 Unstoppable software and AI architect!`;
}

export function getStreakMilestones(streak: number): Array<{ days: number; title: string; rewardXp: number; achieved: boolean }> {
  const milestones = [
    { days: 1, title: 'Ignition Flame', rewardXp: 50 },
    { days: 3, title: 'Habit Locked', rewardXp: 100 },
    { days: 7, title: 'Weekly Legend', rewardXp: 250 },
    { days: 14, title: 'Code Titan', rewardXp: 500 },
    { days: 30, title: 'Grandmaster Architect', rewardXp: 1000 },
  ];
  return milestones.map(m => ({ ...m, achieved: streak >= m.days }));
}

export function getStreakMilestone(streak: number): { nextGoal: number; progressPercent: number } {
  if (streak < 3) return { nextGoal: 3, progressPercent: Math.round((streak / 3) * 100) };
  if (streak < 7) return { nextGoal: 7, progressPercent: Math.round((streak / 7) * 100) };
  if (streak < 14) return { nextGoal: 14, progressPercent: Math.round((streak / 14) * 100) };
  if (streak < 30) return { nextGoal: 30, progressPercent: Math.round((streak / 30) * 100) };
  return { nextGoal: 100, progressPercent: Math.min(100, Math.round((streak / 100) * 100)) };
}

/**
 * Automatically updates streak when a lesson or exercise is completed.
 * If user hasn't completed a lesson today:
 *   - If lastActive was yesterday -> streak increases by 1
 *   - If lastActive was today -> streak maintained
 *   - If lastActive was before yesterday -> streak starts fresh at 1
 */
export function recordLessonCompletion(
  currentProgress: UserProgress,
  lessonId: string,
  xpGained: number = 50,
  lessonTitle: string = 'Interactive Coding Lesson'
): { updatedProgress: UserProgress; isStreakIncreased: boolean; motivationalMessage: string } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const lastActive = currentProgress.lastActiveDate || '';
  
  let newStreak = currentProgress.streak || 1;
  let isStreakIncreased = false;

  // Check if streak was already increased today
  const lastIncrementDate = (currentProgress as any).lastStreakIncrementDate;

  if (lastIncrementDate !== today) {
    if (lastActive === yesterday) {
      newStreak += 1;
      isStreakIncreased = true;
    } else if (lastActive === today) {
      // If already active today but haven't incremented streak yet
      newStreak = Math.max(1, newStreak);
      isStreakIncreased = true;
    } else {
      // Missed a day or brand new
      newStreak = 1;
      isStreakIncreased = true;
    }
  }

  const motivationalMessage = getStreakMotivationalQuote(newStreak);

  // New activity entry
  const newActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: today,
    timestamp: 'Just now',
    action: `Completed: ${lessonTitle} (+${xpGained} XP, ${newStreak}d streak)`,
    xpGained,
    category: 'code' as const,
  };

  const updatedExercises = currentProgress.completedExercises.includes(lessonId)
    ? currentProgress.completedExercises
    : [...currentProgress.completedExercises, lessonId];

  const updatedProgress: UserProgress = {
    ...currentProgress,
    streak: newStreak,
    lastActiveDate: today,
    xp: currentProgress.xp + (currentProgress.completedExercises.includes(lessonId) ? 0 : xpGained),
    completedExercises: updatedExercises,
    activityLog: [newActivity, ...(currentProgress.activityLog || [])].slice(0, 50),
    ...( {
      lastStreakIncrementDate: today,
      lessonsCompletedToday: ((currentProgress as any).lessonsCompletedToday || 0) + 1,
    } as any),
  };

  // Broadcast event so Navbar and UI instantly know about the celebration
  try {
    const celebrationDetail: StreakCelebration = {
      streak: newStreak,
      message: motivationalMessage,
      isIncreased: isStreakIncreased,
      timestamp: Date.now(),
    };
    window.dispatchEvent(new CustomEvent('skillgraph-streak-updated', { detail: celebrationDetail }));
  } catch (err) {
    console.warn('Streak event dispatch failed:', err);
  }

  return {
    updatedProgress,
    isStreakIncreased,
    motivationalMessage,
  };
}
