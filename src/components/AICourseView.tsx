import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Network, 
  Bot, 
  CheckCircle2, 
  Play, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Zap, 
  Flame, 
  Check, 
  Code2, 
  User, 
  Download,
  Share2
} from 'lucide-react';
import { AI_COURSE_MODULES, AICourseLesson } from '../data/curatedAICourse';
import { UserProgress } from '../types';
import { runCodeWithTests } from '../utils/codeRunner';
import { recordLessonCompletion } from '../utils/streakManager';

interface AICourseViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onJumpToCodeLab: (code: string) => void;
  onOpenProofLoop: () => void;
}

export const AICourseView: React.FC<AICourseViewProps> = ({
  progress,
  onUpdateProgress,
  onJumpToCodeLab,
  onOpenProofLoop,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>('ai-101');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  
  // Interactive sandbox inside lesson
  const [sandboxCode, setSandboxCode] = useState<string>('');
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Aspiring AI Engineer');

  // Find active lesson
  const activeLesson: AICourseLesson = 
    AI_COURSE_MODULES.flatMap((m) => m.lessons).find((l) => l.id === selectedLessonId) || 
    AI_COURSE_MODULES[0].lessons[0];

  // Sync sandbox code when lesson changes
  React.useEffect(() => {
    if (activeLesson.interactiveDemoCode) {
      setSandboxCode(activeLesson.interactiveDemoCode);
      setSandboxOutput('');
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setQuizFeedback(null);
    }
  }, [selectedLessonId]);

  const handleRunLessonCode = async () => {
    setIsRunningCode(true);
    setSandboxOutput('Running code...\n');
    try {
      const result = await runCodeWithTests(sandboxCode, []);
      const outputText = result.logs.length > 0 
        ? result.logs.join('\n') 
        : (result.error ? `Error: ${result.error}` : 'Code executed with no output.');
      setSandboxOutput(outputText);
    } catch (err: any) {
      setSandboxOutput(`Execution Error: ${err.message}`);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleAnswerQuiz = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === activeLesson.quiz.correctIndex;
    
    if (isCorrect) {
      setQuizFeedback(`Correct! ${activeLesson.quiz.explanation}`);
      if (!progress.completedExercises.includes(activeLesson.id)) {
        const { updatedProgress } = recordLessonCompletion(progress, activeLesson.id, activeLesson.xpReward, activeLesson.title);
        onUpdateProgress(updatedProgress);
      }
    } else {
      setQuizFeedback(`Incorrect. Try again! ${activeLesson.quiz.explanation}`);
    }
  };

  const allLessons = AI_COURSE_MODULES.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => progress.completedExercises.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in pb-16">
      {/* Course Hero Header with Founder Attribution */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>SkillGraph AI Academy</span>
              </span>

              {/* Curriculum Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Curriculum • <strong className="text-white">5-Stage ProofLoop™</strong></span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Artificial Intelligence Mastery Course
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Learn Machine Learning, Neural Networks, and Generative AI from the ground up through <strong className="text-white">easy real-life physical analogies</strong>, interactive code experiments, and the <strong className="text-cyan-300">ProofLoop™ framework</strong>.
            </p>

            {/* Course Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Course Progress: {completedCount} of {allLessons.length} Lessons</span>
                <span className="text-emerald-400 font-bold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Certificate Action */}
          <div className="flex flex-col items-center sm:items-end gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition transform active:scale-95"
            >
              <Award className="w-4 h-4 fill-slate-950" />
              <span>{progressPercent >= 100 ? 'Claim Verified Certificate' : 'Preview AI Certificate'}</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center sm:text-right">
              Officially verified by <strong className="text-white">SkillGraph Academic Board</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Course Layout: Modules Sidebar + Lesson Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Modules Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Curriculum Modules</span>
              </h3>
              <span className="text-xs text-slate-400">{allLessons.length} Lessons</span>
            </div>

            <div className="space-y-4">
              {AI_COURSE_MODULES.map((module, mIdx) => (
                <div key={module.id} className="space-y-2">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{module.title}</span>
                    <span className="text-cyan-400 text-[10px]">{module.level}</span>
                  </div>

                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isSelected = lesson.id === selectedLessonId;
                      const isCompleted = progress.completedExercises.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setSelectedLessonId(lesson.id);
                            window.scrollTo({ top: 320, behavior: 'smooth' });
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs transition flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                              : 'bg-slate-950/70 border border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                            ) : (
                              <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] ${
                                isSelected ? 'border-white text-white' : 'border-slate-600 text-slate-400'
                              }`}>
                                {lesson.id.split('-')[1]}
                              </div>
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                            }`}>
                              +{lesson.xpReward} XP
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Quote Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-black text-xs text-indigo-300">
                  SG
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">SkillGraph Pedagogy</h4>
                <p className="text-[11px] text-indigo-400 font-medium">Core Learning Framework</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "AI shouldn't be locked behind arcane math papers. When you anchor every algorithm in a real physical metaphor, complex neural networks suddenly feel as intuitive as riding a bicycle."
            </p>
          </div>
        </div>

        {/* Right Active Lesson View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            {/* Lesson Title & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="text-xs text-cyan-400 font-semibold">{activeLesson.moduleTitle}</div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activeLesson.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  {activeLesson.durationMinutes} mins
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{activeLesson.xpReward} XP</span>
                </span>
              </div>
            </div>

            {/* 1. Real-Life Analogy Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-indigo-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>The Real-Life Physical Analogy:</span>
                <strong className="text-white">{activeLesson.analogyTitle}</strong>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeLesson.analogyStory}
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
                <span>Physical Metaphor:</span>
                <strong className="text-white">{activeLesson.analogyObject}</strong>
              </div>
            </div>

            {/* 2. Key Theoretical Concepts */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Key Theoretical Takeaways</span>
              </h3>
              <div className="space-y-2">
                {activeLesson.coreConcepts.map((concept, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{concept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Interactive In-Browser Code Lab */}
            {activeLesson.interactiveDemoCode && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Interactive AI Code Experiment</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onJumpToCodeLab(sandboxCode)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Open in Full Code Lab ➔
                    </button>
                    <button
                      onClick={handleRunLessonCode}
                      disabled={isRunningCode}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isRunningCode ? 'Running...' : 'Run Simulation'}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
                  <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                    <span>lesson-sandbox.js</span>
                    <span>JavaScript Safe Runner</span>
                  </div>
                  <textarea
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-950 p-4 text-indigo-200 font-mono focus:outline-none resize-y selection:bg-indigo-500/30 leading-relaxed"
                  />
                </div>

                {sandboxOutput && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Console Output:</div>
                    {sandboxOutput}
                  </div>
                )}
              </div>
            )}

            {/* 4. Quiz Knowledge Checkpoint */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Knowledge Checkpoint Quiz</span>
                </h4>
                <span className="text-[11px] text-amber-400 font-bold">+{activeLesson.xpReward} XP for Mastery</span>
              </div>

              <p className="text-xs font-semibold text-white leading-relaxed">
                {activeLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {activeLesson.quiz.options.map((option, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  let optionStyles = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (quizSubmitted) {
                    if (idx === activeLesson.quiz.correctIndex) {
                      optionStyles = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold';
                    } else if (isSelected) {
                      optionStyles = 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold';
                    }
                  } else if (isSelected) {
                    optionStyles = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center gap-3 ${optionStyles}`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center font-bold text-[10px] ${
                        isSelected ? 'border-indigo-400 text-white' : 'border-slate-700 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleAnswerQuiz}
                    disabled={selectedQuizOption === null}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="flex items-center gap-3 w-full justify-between">
                    <p className="text-xs font-medium text-slate-300">{quizFeedback}</p>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedQuizOption(null);
                        setQuizFeedback(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 5. ProofLoop Quest Link */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Next Step: Complete ProofLoop™ For This Concept</span>
                </div>
                <p className="text-xs text-slate-400">
                  Ready to explain this concept in your own words and verify your understanding?
                </p>
              </div>

              <button
                onClick={onOpenProofLoop}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition whitespace-nowrap"
              >
                Go to ProofLoop ➔
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
                <Award className="w-8 h-8 fill-amber-400" />
              </div>
              <h2 className="text-xs uppercase tracking-widest text-amber-400 font-black">
                SKILLGRAPH CERTIFIED LEARNING ACADEMY
              </h2>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-white">
                Certificate of AI Mastery
              </h1>
              <p className="text-xs text-slate-400">
                Issued for demonstrated competency in Neural Networks, Deep Learning, and Generative AI.
              </p>
            </div>

            {/* Recipient Name Input */}
            <div className="max-w-md mx-auto space-y-1">
              <label className="text-[11px] text-slate-400 font-medium">Recipient Name:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-center bg-slate-900 border-b-2 border-amber-500 text-lg sm:text-xl font-bold text-white focus:outline-none py-1 font-serif"
                placeholder="Enter Your Full Name"
              />
            </div>

            {/* Certificate Body Text */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              This certifies that <strong>{studentName}</strong> has mastered the core principles of Artificial Intelligence, including Machine Learning foundations, Perceptrons, Backpropagation, Gradient Descent, and Transformer architectures using the 5-Stage <strong className="text-cyan-300">ProofLoop™ System</strong>.
            </p>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 items-center max-w-lg mx-auto">
              <div className="space-y-1 text-center">
                <div className="font-serif italic text-lg sm:text-xl text-amber-300 font-bold tracking-wider">
                  SkillGraph
                </div>
                <div className="w-32 h-0.5 bg-amber-500/60 mx-auto" />
                <div className="text-xs font-bold text-white">Office of the Founder</div>
                <div className="text-[10px] text-slate-400">Academic Council, SkillGraph</div>
              </div>

              <div className="space-y-1 text-center">
                <div className="font-mono text-xs text-cyan-400 font-bold">
                  VERIFIED #{Math.abs(studentName.length * 994597).toString(16).toUpperCase()}
                </div>
                <div className="w-32 h-0.5 bg-cyan-500/60 mx-auto" />
                <div className="text-xs font-bold text-white">ProofLoop™ AI Audit</div>
                <div className="text-[10px] text-slate-400">Issued: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
