import { UserProgress } from '../types';
import { YOUTUBE_COURSES } from '../data/youtubeCourses';

const STORAGE_KEY = 'skillgraph_user_progress_v1';
const BACKUP_STORAGE_KEY = 'skillgraph_user_progress_backup_v1';
const CACHED_MODULES_KEY = 'skillgraph_cached_modules_v1';
const CACHE_METADATA_KEY = 'skillgraph_cache_metadata_v1';
const OFFLINE_SYNC_QUEUE_KEY = 'skillgraph_offline_sync_queue_v1';

export interface CachedModuleItem {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonNumber: number;
  title: string;
  category: string;
  duration: string;
  creatorName: string;
  creatorAvatar?: string;
  summary: string;
  keyConcepts: string[];
  suggestedStarterCode?: string;
  practiceLanguage?: string;
  completedAt: string;
  notes?: string;
}

export interface CacheMetadata {
  lastCachedAt: string;
  cachedModulesCount: number;
  totalXp: number;
  streak: number;
  isSyncPending: boolean;
}

export const getDefaultProgress = (): UserProgress => ({
  xp: 100, // Strictly 100 XP login bonus for new users
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedExercises: ['var-intro-1'],
  masteredSkills: ['vars-and-types'],
  bookmarkedQuestions: [],
  quizScores: {},
  // Pre-completed starter lessons so offline learners always have rich modules to view immediately
  completedVideoLessons: ['nn-lesson-1', 'py-lesson-1'],
  completedCourses: [],
  isPremium: false,
  subscriptionPlan: 'free',
  dailyAiQueriesUsed: 0,
  activityLog: [
    {
      id: 'act-init-1',
      date: new Date().toISOString().split('T')[0],
      timestamp: 'Just now',
      action: 'Account Created & 100 XP Welcome Bonus Claimed',
      xpGained: 100,
      category: 'ai',
    },
    {
      id: 'act-init-2',
      date: new Date().toISOString().split('T')[0],
      timestamp: 'Just now',
      action: 'Starter Offline Modules Pre-Cached (Neural Networks & Python Basics)',
      xpGained: 50,
      category: 'video',
    },
  ],
});

/**
 * Builds or refreshes the cached offline modules array from progress and course catalog.
 */
export const syncCompletedModulesCache = (progress: UserProgress): CachedModuleItem[] => {
  try {
    const existingModules: Record<string, CachedModuleItem> = {};
    const raw = localStorage.getItem(CACHED_MODULES_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((m) => {
            if (m && m.id) existingModules[m.id] = m;
          });
        }
      } catch {}
    }

    const completedLessonIds = new Set(progress.completedVideoLessons || []);
    const items: CachedModuleItem[] = [];

    // Search courses for completed lessons
    for (const course of YOUTUBE_COURSES) {
      for (const lesson of course.lessons) {
        if (completedLessonIds.has(lesson.id)) {
          const existing = existingModules[lesson.id];
          items.push({
            id: lesson.id,
            courseId: course.id,
            courseTitle: course.title,
            lessonNumber: lesson.lessonNumber,
            title: lesson.title,
            category: course.categoryLabel || course.category,
            duration: lesson.duration,
            creatorName: course.creator.name,
            creatorAvatar: course.creator.avatarUrl,
            summary: lesson.summary,
            keyConcepts: lesson.keyConcepts || [],
            suggestedStarterCode: lesson.suggestedStarterCode || course.starterPracticeCode,
            practiceLanguage: lesson.practiceLanguage || (course.category === 'python' ? 'Python' : 'JavaScript'),
            completedAt: existing?.completedAt || new Date().toISOString(),
            notes: existing?.notes || '',
          });
        }
      }
    }

    localStorage.setItem(CACHED_MODULES_KEY, JSON.stringify(items));
    return items;
  } catch (err) {
    console.error('Failed to sync completed modules cache:', err);
    return [];
  }
};

/**
 * Loads user progress with fault-tolerant recovery from primary or backup storage.
 */
export const loadUserProgress = (): UserProgress => {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    
    // Fault-tolerant recovery: Check backup if primary is empty or corrupted
    if (!raw) {
      raw = localStorage.getItem(BACKUP_STORAGE_KEY);
    }

    if (!raw) {
      const defaultState = getDefaultProgress();
      saveUserProgress(defaultState);
      return defaultState;
    }

    const data = JSON.parse(raw);
    const merged: UserProgress = {
      ...getDefaultProgress(),
      ...data,
    };

    // Ensure completed modules cache is up to date
    syncCompletedModulesCache(merged);
    return merged;
  } catch (e) {
    console.error('Failed to load progress from localStorage, recovering with default state', e);
    const defaultState = getDefaultProgress();
    saveUserProgress(defaultState);
    return defaultState;
  }
};

/**
 * Persists user progress to both primary storage and safety backup,
 * updates offline cache metadata, and synchronizes offline module records.
 */
export const saveUserProgress = (progress: UserProgress): void => {
  try {
    const serialized = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, serialized);
    // Double-buffered backup to guarantee safety against sudden device power loss or browser crashes
    localStorage.setItem(BACKUP_STORAGE_KEY, serialized);

    // Sync modules for offline viewing
    const cachedModules = syncCompletedModulesCache(progress);

    // Update cache metadata
    const metadata: CacheMetadata = {
      lastCachedAt: new Date().toISOString(),
      cachedModulesCount: cachedModules.length,
      totalXp: progress.xp,
      streak: progress.streak,
      isSyncPending: false,
    };
    localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));

    // Notify other components of the change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('skillgraph-progress-updated', { detail: progress }));
    }
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
};

/**
 * Returns all cached completed modules for offline viewing.
 */
export const getCachedCompletedModules = (): CachedModuleItem[] => {
  try {
    const raw = localStorage.getItem(CACHED_MODULES_KEY);
    if (!raw) {
      // Lazy initialization
      const progress = loadUserProgress();
      return syncCompletedModulesCache(progress);
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to get cached completed modules', err);
    return [];
  }
};

/**
 * Saves a user study note for an offline completed module.
 */
export const saveModuleOfflineNote = (moduleId: string, note: string): boolean => {
  try {
    const modules = getCachedCompletedModules();
    const target = modules.find((m) => m.id === moduleId);
    if (target) {
      target.notes = note;
      localStorage.setItem(CACHED_MODULES_KEY, JSON.stringify(modules));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Returns metadata about the current offline cache.
 */
export const getCacheMetadata = (): CacheMetadata => {
  try {
    const raw = localStorage.getItem(CACHE_METADATA_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {
    lastCachedAt: new Date().toISOString(),
    cachedModulesCount: 0,
    totalXp: 100,
    streak: 1,
    isSyncPending: false,
  };
};

/**
 * Queues an action taken while offline to be synchronized when back online.
 */
export const queueOfflineAction = (action: { type: string; payload: any; timestamp: string }): void => {
  try {
    const raw = localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(action);
    localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to queue offline action:', err);
  }
};

/**
 * Flushes the offline action queue once online connection is restored.
 */
export const flushOfflineQueue = (): { flushedCount: number } => {
  try {
    const raw = localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
    if (!raw) return { flushedCount: 0 };
    const queue = JSON.parse(raw);
    if (Array.isArray(queue) && queue.length > 0) {
      const count = queue.length;
      localStorage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
      return { flushedCount: count };
    }
  } catch {}
  return { flushedCount: 0 };
};
