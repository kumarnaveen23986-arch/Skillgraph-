export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LanguageTone = 'simple-english' | 'hinglish' | 'eli5' | 'technical';

export type TrackCategory = 
  | 'python-fundamentals'
  | 'javascript-fundamentals'
  | 'coding-foundations'
  | 'ai-ml-foundations'
  | 'neural-networks'
  | 'web-engineering'
  | 'algorithms'
  | 'modern-genai';

export interface SkillNode {
  id: string;
  title: string;
  track: TrackCategory;
  difficulty: DifficultyLevel;
  iconName: string;
  shortTagline: string;
  programmingLanguage?: 'Python' | 'JavaScript' | 'Universal';
  realLifeAnalogy: {
    title: string;
    story: string;
    metaphorItem: string;
  };
  keyTakeaway: string;
  prerequisites: string[];
  position: { x: number; y: number };
  relatedExerciseId?: string;
  codeSnippet: string;
}

export interface TestCase {
  inputDescription: string;
  evalSnippet: string;
  expectedOutput: string;
}

export interface Exercise {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  track: TrackCategory;
  language: 'JavaScript' | 'Python' | 'Universal';
  realLifeStory: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  solutionAnalogy: string;
  testCases: TestCase[];
  hints: string[];
  xpReward: number;
}

export interface AIExplanationResponse {
  title: string;
  analogyTitle: string;
  analogy: string;
  coreConcept: string;
  codeSnippet: string;
  codeExplanation: string;
  realWorldApplication: string;
  commonGotchas: string[];
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  followUpQuestions: string[];
}

export interface BugDiagnosis {
  bugName: string;
  analogyTitle: string;
  analogyStory: string;
  rootCause: string;
  fixedCode: string;
  fixExplanation: string;
  preventionTip: string;
}

export interface ForumAnswer {
  id: string;
  author: string;
  authorRole: 'Instructor' | 'AI Mentor' | 'Student' | 'Staff';
  avatar?: string;
  createdAt: string;
  upvotes: number;
  analogy?: string;
  content: string;
  codeSnippet?: string;
}

export interface ForumQuestion {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: 'Student' | 'Instructor';
  category: 'Python' | 'JavaScript' | 'AI & ML' | 'Neural Networks' | 'Debugging' | 'General';
  codeSnippet?: string;
  createdAt: string;
  upvotes: number;
  answers: ForumAnswer[];
  isSolved: boolean;
}

export interface VideoLesson {
  id: string;
  lessonNumber: number;
  title: string;
  youtubeId: string;
  duration: string;
  summary: string;
  keyConcepts: string[];
  suggestedStarterCode?: string;
  practiceLanguage?: 'Python' | 'JavaScript' | 'C++' | 'Java' | 'SQL' | 'HTML';
  isPremiumOnly?: boolean;
}

export type SubscriptionPlan = 'free' | 'pro_99' | 'advanced_299';

export interface UserActivityItem {
  id: string;
  date: string;
  timestamp: string;
  action: string;
  xpGained: number;
  category: 'code' | 'video' | 'proofloop' | 'ai' | 'quiz' | 'flowai';
}

export interface YouTubeCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'ai-ml' | 'python' | 'javascript' | 'web-dev' | 'cpp' | 'java' | 'sql' | 'dsa' | 'app-dev' | 'video-editing' | 'trending-effects';
  categoryLabel: string;
  creator: {
    name: string;
    channelName: string;
    channelUrl: string;
    avatarUrl: string;
    subscribers?: string;
  };
  language: 'Hindi / Hinglish' | 'English';
  difficulty: 'Beginner' | 'Zero Prerequisites' | 'Intermediate';
  thumbnailUrl: string;
  totalDuration: string;
  totalLessons: number;
  prerequisites: string[];
  syllabusTopics: string[];
  lessons: VideoLesson[];
  starterPracticeCode?: string;
  isPremiumOnly?: boolean;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedExercises: string[];
  masteredSkills: string[];
  bookmarkedQuestions: string[];
  quizScores: Record<string, boolean>;
  completedVideoLessons?: string[];
  completedCourses?: string[];
  isPremium?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  proDuration?: '1month' | '3month' | '1year' | 'lifetime';
  proExpiresAt?: number;
  proExpiresAtFormatted?: string;
  dailyAiQueriesUsed?: number;
  lastAiQueryDate?: string;
  activityLog?: UserActivityItem[];
}
