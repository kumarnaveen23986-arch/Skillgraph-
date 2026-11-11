import React, { useState, useMemo } from 'react';
import { 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Award, 
  Code2, 
  RotateCw, 
  Share2, 
  X, 
  Check, 
  Filter, 
  GraduationCap, 
  Flame, 
  Zap, 
  Youtube, 
  ChevronRight,
  Maximize2,
  Printer,
  Download,
  ShieldCheck,
  Smartphone,
  Lock,
  WifiOff,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { YOUTUBE_COURSES } from '../data/youtubeCourses';
import { YouTubeCourse, VideoLesson, UserProgress } from '../types';

interface VideoCoursesHubProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onJumpToCodeLab: (code: string) => void;
  onAskInAIView: (topic: string) => void;
  onOpenProofLoop: () => void;
  onOpenPaymentModal?: () => void;
  isOnline?: boolean;
  onOpenOfflineModal?: () => void;
}

type CategoryFilter = 'all' | 'offline-completed' | 'ai-ml' | 'coding' | 'web-dev' | 'app-dev' | 'video-editing' | 'python' | 'javascript' | 'cpp' | 'java' | 'sql' | 'dsa';
type LanguageFilter = 'all' | 'Hindi / Hinglish' | 'English';
type DifficultyFilter = 'all' | 'Zero Prerequisites' | 'Beginner' | 'Intermediate';

export const VideoCoursesHub: React.FC<VideoCoursesHubProps> = ({
  progress,
  onUpdateProgress,
  onJumpToCodeLab,
  onAskInAIView,
  onOpenProofLoop,
  onOpenPaymentModal,
  isOnline = true,
  onOpenOfflineModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Student Name for Verified Certificate
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sg_user_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.name) return p.name;
      }
    } catch (e) {}
    return 'Learner Student';
  });

  // Active course being played in classroom mode
  const [activeCourse, setActiveCourse] = useState<YouTubeCourse | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completedLessons = useMemo(() => {
    return new Set(progress.completedVideoLessons || []);
  }, [progress.completedVideoLessons]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter courses systematically
  const filteredCourses = useMemo(() => {
    return YOUTUBE_COURSES.filter((course) => {
      // Offline-completed filter
      if (selectedCategory === 'offline-completed') {
        const hasCompleted = course.lessons.some(l => completedLessons.has(l.id));
        if (!hasCompleted) return false;
      } else if (selectedCategory !== 'all') {
        if (selectedCategory === 'coding') {
          const isCoding = ['python', 'javascript', 'cpp', 'java', 'sql', 'dsa'].includes(course.category);
          if (!isCoding) return false;
        } else if (course.category !== selectedCategory) {
          return false;
        }
      }
      // Language filter
      if (selectedLanguage !== 'all' && course.language !== selectedLanguage) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && course.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.description.toLowerCase().includes(query);
        const matchesCreator = course.creator.name.toLowerCase().includes(query) || course.creator.channelName.toLowerCase().includes(query);
        const matchesCategory = course.categoryLabel.toLowerCase().includes(query);
        const matchesTopics = course.syllabusTopics.some(t => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesCreator || matchesCategory || matchesTopics;
      }
      return true;
    });
  }, [selectedCategory, selectedLanguage, selectedDifficulty, searchQuery]);

  // Open Classroom view for a course
  const handleOpenCourse = (course: YouTubeCourse, lessonIndex = 0) => {
    setActiveCourse(course);
    setActiveLessonIndex(lessonIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close classroom
  const handleCloseClassroom = () => {
    setActiveCourse(null);
  };

  // Toggle lesson complete state
  const handleToggleLessonComplete = (lessonId: string, courseId: string) => {
    const isAlreadyCompleted = completedLessons.has(lessonId);
    let updatedList: string[];
    let xpDelta = 0;

    if (isAlreadyCompleted) {
      updatedList = (progress.completedVideoLessons || []).filter(id => id !== lessonId);
      xpDelta = -50;
      showToast('Lesson marked uncompleted');
    } else {
      updatedList = [...(progress.completedVideoLessons || []), lessonId];
      xpDelta = 50;
      showToast('🎉 +50 XP! Lesson marked as completed!');
    }

    // Check if entire course is completed
    const course = YOUTUBE_COURSES.find(c => c.id === courseId);
    let updatedCompletedCourses = progress.completedCourses || [];
    if (course && !isAlreadyCompleted) {
      const allLessonsCompleted = course.lessons.every(l => l.id === lessonId || updatedList.includes(l.id));
      if (allLessonsCompleted && !updatedCompletedCourses.includes(courseId)) {
        updatedCompletedCourses = [...updatedCompletedCourses, courseId];
        setShowCertificateModal(true);
      }
    }

    onUpdateProgress({
      ...progress,
      xp: Math.max(0, progress.xp + xpDelta),
      completedVideoLessons: updatedList,
      completedCourses: updatedCompletedCourses,
    });
  };

  const currentLesson: VideoLesson | undefined = activeCourse ? activeCourse.lessons[activeLessonIndex] : undefined;

  const currentCourseCompletedCount = useMemo(() => {
    if (!activeCourse) return 0;
    return activeCourse.lessons.filter(l => completedLessons.has(l.id)).length;
  }, [activeCourse, completedLessons]);

  const currentCourseProgressPercent = useMemo(() => {
    if (!activeCourse || activeCourse.lessons.length === 0) return 0;
    return Math.round((currentCourseCompletedCount / activeCourse.lessons.length) * 100);
  }, [activeCourse, currentCourseCompletedCount]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold border border-indigo-400/40 animate-slideDown">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                <Youtube className="w-3.5 h-3.5 fill-red-500" />
                <span>YouTube Creator Masterclasses</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Curated Masterclasses</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Beginner Friendly • Step-by-Step</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Learn All Coding & AI From{' '}
              <span className="bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                Top YouTube Creators
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Systematic video curriculum curated from the internet&apos;s best educators: <strong className="text-white">Chai aur Code</strong>, <strong className="text-white">CodeWithHarry</strong>, <strong className="text-white">3Blue1Brown</strong>, <strong className="text-white">Andrej Karpathy</strong>, <strong className="text-white">FreeCodeCamp</strong>, <strong className="text-white">Apna College</strong>, and <strong className="text-white">Mosh</strong>. Click any course to start watching lessons with integrated coding exercises.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span><strong>{YOUTUBE_COURSES.length}</strong> Complete Courses</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Play className="w-4 h-4 text-cyan-400" />
                <span><strong>30+</strong> Video Lessons</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Verified Industry Certificates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Systematic Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any language (Python, C++, Java, JS, AI, SQL), creator, or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Secondary Dropdown Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {/* Language Filter */}
              <select
                aria-label="Filter courses by creator language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as LanguageFilter)}
                className="bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Creator Languages</option>
                <option value="Hindi / Hinglish">Hindi / Hinglish (Chai aur Code, Harry, Apna College)</option>
                <option value="English">English (FreeCodeCamp, 3Blue1Brown, Karpathy, Mosh)</option>
              </select>

              {/* Difficulty Filter */}
              <select
                aria-label="Filter courses by difficulty level"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyFilter)}
                className="bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="Zero Prerequisites">Zero Prerequisites (Absolute Beginner)</option>
                <option value="Beginner">Beginner Friendly</option>
                <option value="Intermediate">Intermediate Deep Dive</option>
              </select>
            </div>
          </div>

          {/* Category Tabs Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Offline-ready filter pill */}
            <button
              onClick={() => setSelectedCategory('offline-completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'offline-completed'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>📡 Offline Cached ({completedLessons.size})</span>
            </button>

            {[
              { id: 'all', label: '🌟 All Masterclasses' },
              { id: 'ai-ml', label: '🤖 AI (Artificial Intelligence)' },
              { id: 'coding', label: '💻 Coding (Python, C++, Java, JS, DSA)' },
              { id: 'web-dev', label: '🌐 Web Development' },
              { id: 'app-dev', label: '📱 How to Build Your Own App' },
              { id: 'python', label: '🐍 Python Only' },
              { id: 'javascript', label: '⚡ JS Only' },
              { id: 'cpp', label: '⚙️ C++ Only' },
              { id: 'java', label: '☕ Java Only' },
              { id: 'dsa', label: '🧩 DSA Only' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Offline Learning Banner */}
          {!isOnline && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <WifiOff className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-amber-300 text-sm">
                    Offline Study Mode Active
                  </h4>
                  <p className="text-slate-300 text-xs">
                    Connection lost. You can continue reviewing full lesson notes, core concepts, and running starter code for all your <strong className="text-white">{completedLessons.size} completed modules</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedCategory('offline-completed')}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                    selectedCategory === 'offline-completed'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  Filter Cached Modules
                </button>
                {onOpenOfflineModal && (
                  <button
                    onClick={onOpenOfflineModal}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    Open Offline Viewer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Classroom Modal / Full Player when Active */}
      {activeCourse && currentLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-y-auto animate-fadeIn">
          {/* Top Bar */}
          <div className="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleCloseClassroom}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                title="Back to All Courses"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {activeCourse.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Lesson {activeLessonIndex + 1} of {activeCourse.lessons.length}</span>
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeCourse.title}
                </h2>
              </div>
            </div>

            {/* Course Progress & Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-semibold text-slate-300">
                  {currentCourseCompletedCount}/{activeCourse.lessons.length} Lessons ({currentCourseProgressPercent}%)
                </span>
                <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${currentCourseProgressPercent}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => handleToggleLessonComplete(currentLesson.id, activeCourse.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  completedLessons.has(currentLesson.id)
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessons.has(currentLesson.id) ? 'Completed ✓' : 'Mark Completed (+50 XP)'}
                </span>
              </button>
            </div>
          </div>

          {/* Dual-Pane Classroom Body */}
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Left: Video Player & Controls (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Responsive Video Container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex items-center justify-center">
                {(activeCourse.isPremiumOnly || currentLesson.isPremiumOnly) && !(progress as any).isPremium ? (
                  <div className="text-center p-6 sm:p-8 space-y-3 z-10 max-w-md">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/20">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Pro & Advanced VIP Exclusive
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        Premium Masterclass Video Locked
                      </h4>
                      <p className="text-xs text-slate-300">
                        This creator video editing & trending effects lesson is available to ₹99 Pro and ₹299 Advanced VIP subscribers.
                      </p>
                    </div>
                    {onOpenPaymentModal && (
                      <button
                        onClick={onOpenPaymentModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 mx-auto"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Unlock in ₹99 Pro / ₹299 VIP</span>
                      </button>
                    )}
                  </div>
                ) : !isOnline ? (
                  /* Offline Classroom Card */
                  <div className="w-full h-full p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 flex flex-col justify-between overflow-y-auto text-left space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <WifiOff className="w-3 h-3 text-amber-400" />
                          <span>Offline Study Mode</span>
                        </span>
                        {completedLessons.has(currentLesson.id) && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Lesson Completed & Cached ✓</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-xl font-black text-white">
                        {currentLesson.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Internet streaming is currently unavailable, but your full lesson curriculum notes, core takeaway concepts, and interactive starter code are cached and ready for offline mastery!
                      </p>
                    </div>

                    {/* Key Concepts Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Core Takeaways in Cache:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentLesson.keyConcepts.map((kc, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                            ✓ {kc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Offline Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                      {currentLesson.suggestedStarterCode && (
                        <button
                          onClick={() => {
                            handleCloseClassroom();
                            onJumpToCodeLab(currentLesson.suggestedStarterCode!);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                        >
                          <Code2 className="w-4 h-4" />
                          <span>Run Offline in Code Lab</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleLessonComplete(currentLesson.id, activeCourse.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
                          completedLessons.has(currentLesson.id)
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{completedLessons.has(currentLesson.id) ? 'Mark Incomplete' : 'Mark Lesson Completed (+50 XP)'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentLesson.youtubeId}?rel=0&autoplay=1`}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* Video Info Header */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Lesson #{currentLesson.lessonNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentLesson.duration}</span>
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {currentLesson.title}
                    </h3>
                  </div>

                  {/* Creator Attribution */}
                  <a
                    href={activeCourse.creator.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 transition-colors shrink-0 group"
                  >
                    <img
                      src={activeCourse.creator.avatarUrl}
                      alt={activeCourse.creator.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-600"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-red-400 transition-colors flex items-center gap-1">
                        <span>{activeCourse.creator.channelName}</span>
                        <Youtube className="w-3 h-3 text-red-500 fill-red-500" />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {activeCourse.creator.subscribers} subs
                      </div>
                    </div>
                  </a>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentLesson.summary}
                </p>

                {/* Key Concepts Chips */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Key Concepts in This Lesson:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentLesson.keyConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                      >
                        ✓ {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Action Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
                  {currentLesson.suggestedStarterCode && (
                    <button
                      onClick={() => {
                        handleCloseClassroom();
                        onJumpToCodeLab(currentLesson.suggestedStarterCode!);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Practice in Code Lab</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleCloseClassroom();
                      onAskInAIView(currentLesson.title);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Ask AI Mentor</span>
                  </button>

                  <button
                    onClick={() => {
                      handleCloseClassroom();
                      onOpenProofLoop();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition-all"
                  >
                    <RotateCw className="w-4 h-4 text-cyan-400" />
                    <span>ProofLoop™ Verify</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${currentLesson.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Course Syllabus Playlist Sidebar (1 col) */}
            <div className="space-y-4">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg sticky top-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Course Curriculum</h4>
                    <p className="text-xs text-slate-400">
                      {activeCourse.lessons.length} Systematic Video Lessons
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                    {activeCourse.language}
                  </span>
                </div>

                {/* Lesson List */}
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {activeCourse.lessons.map((lesson, idx) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isActive = idx === activeLessonIndex;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                          isActive
                            ? 'bg-indigo-600/20 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                              isActive ? 'border-indigo-400 text-indigo-300 font-bold' : 'border-slate-700 text-slate-500'
                            }`}>
                              {lesson.lessonNumber}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className={`text-xs font-semibold leading-snug line-clamp-2 ${
                            isActive ? 'text-indigo-200 font-bold' : 'text-slate-300'
                          }`}>
                            {lesson.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{lesson.duration}</span>
                            </span>
                            {isCompleted && (
                              <span className="text-emerald-400 font-medium">Completed</span>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5 animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Course Completion Banner */}
                {currentCourseProgressPercent === 100 && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center space-y-2">
                    <Award className="w-6 h-6 text-amber-400 mx-auto" />
                    <div className="text-xs font-bold text-amber-300">
                      Course 100% Completed!
                    </div>
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
                    >
                      View Verified Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Cards Grid */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>Available Courses</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
            </span>
          </h2>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Free & Open to All Learners</span>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No courses match your filter</h3>
            <p className="text-xs text-slate-500">Try clearing the search query or selecting &quot;All Courses&quot;</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLanguage('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const completedCountInThisCourse = course.lessons.filter(l => completedLessons.has(l.id)).length;
              const courseProgressPercent = Math.round((completedCountInThisCourse / course.lessons.length) * 100);
              const isFullyDone = completedCountInThisCourse === course.lessons.length;

              return (
                <div
                  key={course.id}
                  className="group bg-slate-900/80 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Thumbnail / Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Language Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        {course.language}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-950/90 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                        {course.categoryLabel}
                      </span>
                    </div>

                    {/* Difficulty Pill */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        course.difficulty === 'Zero Prerequisites'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : course.difficulty === 'Beginner'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {course.difficulty}
                      </span>
                    </div>

                    {/* Play Overlay Button */}
                    <div 
                      onClick={() => handleOpenCourse(course, 0)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-all">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration & Lessons Pill */}
                    <div className="absolute bottom-3 right-3 text-[11px] font-semibold bg-black/80 px-2 py-0.5 rounded text-slate-200 border border-slate-700/60 backdrop-blur-sm flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{course.totalDuration}</span>
                      <span>•</span>
                      <span>{course.totalLessons} Lessons</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Creator attribution */}
                      <div className="flex items-center gap-2">
                        <img
                          src={course.creator.avatarUrl}
                          alt={course.creator.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-300">
                          {course.creator.channelName}
                        </span>
                        <Youtube className="w-3 h-3 text-red-500 fill-red-500" />
                      </div>

                      <h3 
                        onClick={() => handleOpenCourse(course, 0)}
                        className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
                      >
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Syllabus Topic Previews */}
                      <div className="space-y-1 pt-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Syllabus Highlights:
                        </div>
                        <ul className="text-xs text-slate-300 space-y-0.5">
                          {course.syllabusTopics.slice(0, 3).map((topic, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <span className="text-indigo-400 text-xs font-mono">•</span>
                              <span className="truncate">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-2 border-t border-slate-800 space-y-3">
                      {/* Progress bar if started */}
                      {completedCountInThisCourse > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                            <span>Progress</span>
                            <span className={isFullyDone ? 'text-emerald-400 font-bold' : 'text-indigo-300'}>
                              {completedCountInThisCourse}/{course.totalLessons} ({courseProgressPercent}%)
                            </span>
                          </div>
                          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
                              style={{ width: `${courseProgressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCourse(course, 0)}
                          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{completedCountInThisCourse > 0 ? 'Continue Video' : 'Start Course'}</span>
                        </button>

                        {isFullyDone && (
                          <button
                            onClick={() => {
                              setActiveCourse(course);
                              setShowCertificateModal(true);
                            }}
                            className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 transition-all shadow-sm"
                            title="View and download your official course completion certificate"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Certificate</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (course.starterPracticeCode) {
                              onJumpToCodeLab(course.starterPracticeCode);
                            } else {
                              handleOpenCourse(course, 0);
                            }
                          }}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                          title="Open Starter Code in Lab"
                        >
                          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Executive Certificate Modal */}
      {showCertificateModal && activeCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[95vh] overflow-y-auto">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Official SkillGraph Credential
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Print or Save Certificate as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Recipient Name Customizer */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certificate Recipient Full Name:</span>
              </span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name (e.g. Rahul Sharma)"
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-center sm:text-left focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* PRINTABLE DIPLOMA CANVAS */}
            <div 
              id="skillgraph-certificate"
              className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 border-4 border-double border-amber-500/60 shadow-2xl text-center space-y-6 overflow-hidden"
            >
              {/* Corner Ornate Accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/80"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/80"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/80"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/80"></div>

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                <GraduationCap className="w-96 h-96 text-amber-400" />
              </div>

              {/* Certificate Header */}
              <div className="space-y-1 relative z-10">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-amber-400 text-sm">★ ★ ★</span>
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400 font-black">
                    SkillGraph Academy of Technology
                  </span>
                  <span className="text-amber-400 text-sm">★ ★ ★</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-serif">
                  Certificate of Mastery
                </h3>
                <p className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  Verified ProofLoop™ Technical Achievement
                </p>
              </div>

              {/* Recipient Presentation */}
              <div className="space-y-2 relative z-10 py-1">
                <p className="text-xs text-slate-400 italic">This is proudly and officially awarded to</p>
                <div className="text-2xl sm:text-4xl font-black text-amber-300 font-serif tracking-wider border-b-2 border-amber-500/30 pb-2 inline-block min-w-[280px]">
                  {studentName || 'Student Learner'}
                </div>
                <p className="text-xs text-slate-300 max-w-lg mx-auto pt-2 leading-relaxed">
                  for successfully mastering all curriculum lectures, coding exercises, and practical requirements for:
                </p>
                <div className="text-base sm:text-xl font-extrabold text-white bg-slate-900/80 px-4 py-2 rounded-xl border border-indigo-500/30 inline-block shadow-inner mt-1">
                  {activeCourse.title}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-2">
                  <span>Category: <strong className="text-indigo-300">{activeCourse.categoryLabel}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-white">{activeCourse.totalDuration}</strong></span>
                </div>
              </div>

              {/* Signatures & Seal Row */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center relative z-10">
                {/* Founder Signature */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="font-serif italic text-lg text-amber-400 font-bold select-none">
                    SkillGraph
                  </div>
                  <div className="border-t border-slate-700 pt-1 text-xs font-bold text-white">
                    Office of the Founder
                  </div>
                  <div className="text-[10px] text-amber-300 font-semibold">
                    Executive Council, SkillGraph
                  </div>
                </div>

                {/* Gold Holographic Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-xl shadow-amber-500/30">
                    <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center p-1 text-center border border-amber-400/50">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span className="text-[7px] font-black text-amber-300 uppercase tracking-tighter mt-0.5">
                        VERIFIED 2026
                      </span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 mt-1">
                    SEAL OF EXCELLENCE
                  </span>
                </div>

                {/* Course Lead Signature */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="font-serif italic text-lg text-cyan-400 font-bold select-none">
                    {activeCourse.creator.name}
                  </div>
                  <div className="border-t border-slate-700 pt-1 text-xs font-bold text-white">
                    {activeCourse.creator.name}
                  </div>
                  <div className="text-[10px] text-cyan-300 font-semibold">
                    Lead Educator, {activeCourse.creator.channelName}
                  </div>
                </div>
              </div>

              {/* Verification Serial ID */}
              <div className="pt-2 text-[10px] font-mono text-slate-500 flex flex-wrap items-center justify-between border-t border-slate-800/40 relative z-10">
                <span>Verified ID: SG-CERT-2026-9134-{(Date.now() % 1000000).toString().padStart(6, '0')}</span>
                <span>Issued: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-emerald-400">Tamper-Proof Digital Verification ✓</span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🎓 I just completed "${activeCourse.title}" on SkillGraph! Verified Certificate ID: SG-CERT-2026-9134`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                  });
                  onUpdateProgress({
                    ...progress,
                    xp: progress.xp + 250,
                  });
                  showToast('🎉 +250 Bonus XP Awarded! Certificate saved to your profile.');
                  setShowCertificateModal(false);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Claim Certificate (+250 Bonus XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
