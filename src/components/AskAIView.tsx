import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Send, 
  Check, 
  Copy, 
  HelpCircle, 
  AlertTriangle, 
  Globe2, 
  Code2, 
  ArrowRight, 
  RefreshCw, 
  BookMarked,
  Layers,
  Award,
  Play,
  Lock,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRESET_TOPICS } from '../data/curatedExplanations';
import { AIExplanationResponse, LanguageTone, UserProgress } from '../types';

interface AskAIViewProps {
  languageTone: LanguageTone;
  setLanguageTone: (tone: LanguageTone) => void;
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  initialQuestion?: string;
  onJumpToCodeLab: (code: string) => void;
  onOpenPaymentModal?: () => void;
}

export const AskAIView: React.FC<AskAIViewProps> = ({
  languageTone,
  setLanguageTone,
  progress,
  onUpdateProgress,
  initialQuestion,
  onJumpToCodeLab,
  onOpenPaymentModal,
}) => {
  const [questionInput, setQuestionInput] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIExplanationResponse | null>(
    PRESET_TOPICS[0].cachedResponse
  );
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const isQuotaExhausted = !progress.isPremium && (progress.dailyAiQueriesUsed || 0) >= 5;

  const handleAsk = async (queryToAsk: string) => {
    const trimmed = queryToAsk.trim();
    if (!trimmed) return;

    if (!progress.isPremium && (progress.dailyAiQueriesUsed || 0) >= 5) {
      setErrorMessage(
        'Daily Free AI Quota Reached (5/5 queries used). Normal users get 5 AI Mentor explanations daily. Upgrade to ₹99 Pro Pass or ₹299 Advanced VIP Pass for Unlimited AI Guidance!'
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);

    // Check if matching preset first for lightning fast response
    const matchedPreset = PRESET_TOPICS.find(
      (p) => p.question.toLowerCase().includes(trimmed.toLowerCase()) ||
             trimmed.toLowerCase().includes(p.id.toLowerCase())
    );

    // If exact preset and default english, we can show instantly or still fetch fresh
    if (matchedPreset && languageTone === 'simple-english') {
      setTimeout(() => {
        setCurrentResponse(matchedPreset.cachedResponse);
        setLoading(false);

        // Record query used
        const newCount = (progress.dailyAiQueriesUsed || 0) + 1;
        const newLog = [
          {
            id: 'act-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            timestamp: 'Just now',
            action: `Asked AI Mentor: "${trimmed.slice(0, 36)}..."`,
            xpGained: 10,
            category: 'ai' as const,
          },
          ...(progress.activityLog || []),
        ];
        onUpdateProgress({
          ...progress,
          dailyAiQueriesUsed: newCount,
          activityLog: newLog,
          xp: progress.xp + 10,
        });
      }, 300);
      return;
    }

    try {
      const stepTimer1 = setTimeout(() => setLoadingStep(1), 500);
      const stepTimer2 = setTimeout(() => setLoadingStep(2), 1200);

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          languageTone,
          level: 'Beginner',
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error while generating explanation');
      }

      const data: AIExplanationResponse = await res.json();
      setCurrentResponse(data);

      // Record query used and log activity
      const newCount = (progress.dailyAiQueriesUsed || 0) + 1;
      const newLog = [
        {
          id: 'act-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          timestamp: 'Just now',
          action: `Asked AI Mentor: "${trimmed.slice(0, 36)}..."`,
          xpGained: 10,
          category: 'ai' as const,
        },
        ...(progress.activityLog || []),
      ];
      onUpdateProgress({
        ...progress,
        dailyAiQueriesUsed: newCount,
        activityLog: newLog,
        xp: progress.xp + 10,
      });
    } catch (err: any) {
      console.warn('API call failed, falling back to preset if available', err);
      if (matchedPreset) {
        setCurrentResponse(matchedPreset.cachedResponse);
      } else {
        setErrorMessage(
          err.message || 'Could not connect to Gemini AI. Check your internet or API key in Settings.'
        );
      }
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted || !currentResponse) return;
    setSelectedQuizOption(index);
    setQuizSubmitted(true);

    const isCorrect = index === currentResponse.miniQuiz.correctIndex;
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      // Award XP
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 20,
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Search & Ask Bar */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Concept Explainer</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Ask Any Coding or AI Question
          </h1>
          <p className="text-slate-400 text-sm">
            Get crystal-clear explanations anchored to relatable real-life analogies, clean code, and zero jargon.
          </p>
        </div>

        {/* Tone Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Style:</span>
          {(
            [
              { id: 'simple-english', label: '🌟 Real-Life Analogy (English)' },
              { id: 'hinglish', label: '🇮🇳 Hinglish (Easy Blend)' },
              { id: 'eli5', label: '🧸 ELI5 (Like I\'m 5)' },
              { id: 'technical', label: '⚙️ Technical Deep-Dive' },
            ] as const
          ).map((tone) => (
            <button
              key={tone.id}
              onClick={() => setLanguageTone(tone.id as LanguageTone)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                languageTone === tone.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tone.label}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(questionInput);
          }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="e.g. What is Backpropagation? Why async/await? How does ChatGPT remember things?"
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xl transition-all"
            />
            <button
              type="submit"
              disabled={loading || !questionInput.trim()}
              className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Ask</span>
            </button>
          </div>
        </form>

        {/* Daily Quota Indicator */}
        <div className="flex items-center justify-between max-w-3xl mx-auto px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${progress.isPremium ? 'bg-emerald-400' : isQuotaExhausted ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
            <span className="text-slate-400 font-medium">
              {progress.isPremium 
                ? '⚡ Pro Pass Active: Unlimited AI Guidance & Explanations' 
                : `AI Personal Teacher: ${Math.max(0, 5 - (progress.dailyAiQueriesUsed || 0))}/5 Daily Queries Remaining`}
            </span>
          </div>

          {!progress.isPremium && (
            <button
              type="button"
              onClick={onOpenPaymentModal}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Unlock Unlimited (₹99 / ₹299)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quota Exceeded VIP Warning Banner */}
        {isQuotaExhausted && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Daily Free Limit Reached (5/5 queries used).</strong> Normal users have 5 daily queries. Upgrade to Pro for unlimited guidance!
              </span>
            </div>
            <button
              onClick={onOpenPaymentModal}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold transition-all shadow-md shrink-0"
            >
              Upgrade to Pro (₹99)
            </button>
          </div>
        )}

        {/* Popular Presets Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto pt-1">
          <span className="text-xs text-slate-500 font-medium">Quick Ideas:</span>
          {PRESET_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setQuestionInput(topic.question);
                handleAsk(topic.question);
              }}
              className="text-xs px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-slate-700 transition-all truncate max-w-xs"
            >
              {topic.question}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 animate-pulse text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              {loadingStep === 0 && 'Connecting to SkillGraph AI Engine...'}
              {loadingStep === 1 && 'Finding the perfect real-life analogy...'}
              {loadingStep === 2 && 'Crafting commented code snippet & interactive quiz...'}
            </h3>
            <p className="text-xs text-slate-400">
              Anchoring abstract computer science into everyday physical concepts
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-md mx-auto">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-3/4 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMessage && !loading && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => handleAsk(questionInput || 'What is Backpropagation?')}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main AI Explanation Result Display */}
      {currentResponse && !loading && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                  Concept Breakdown
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Style: {languageTone.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentResponse.title}
              </h2>
            </div>

            {/* 1. Real Life Analogy Box (The Core Hook!) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-slate-900 border border-amber-500/30 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>The Real-Life Analogy: {currentResponse.analogyTitle}</span>
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {currentResponse.analogy}
              </p>
            </div>

            {/* 2. Core Technical Concept */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>How it Actually Works in Code / AI</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {currentResponse.coreConcept}
              </p>
            </div>

            {/* 3. Code Snippet with Run in Sandbox */}
            {currentResponse.codeSnippet && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Real Implementation Example:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(currentResponse.codeSnippet)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onJumpToCodeLab(currentResponse.codeSnippet)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-semibold transition-all border border-indigo-500/30"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Test in Sandbox</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono overflow-x-auto leading-relaxed">
                  <code>{currentResponse.codeSnippet}</code>
                </pre>

                {currentResponse.codeExplanation && (
                  <p className="text-xs text-slate-400 italic">
                    💡 {currentResponse.codeExplanation}
                  </p>
                )}
              </div>
            )}

            {/* 4. Real World Application */}
            {currentResponse.realWorldApplication && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed font-medium flex items-start gap-2.5">
                <Globe2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Where you experience this in real apps: </strong>
                  {currentResponse.realWorldApplication}
                </div>
              </div>
            )}

            {/* 5. Common Gotchas */}
            {currentResponse.commonGotchas && currentResponse.commonGotchas.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Common Mistakes & Gotchas</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentResponse.commonGotchas.map((gotcha, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-slate-300 leading-relaxed"
                    >
                      ⚠️ {gotcha}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Mini Concept-Check Quiz */}
            {currentResponse.miniQuiz && (
              <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>Quick Concept Check (+20 XP)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    1-Click Quiz
                  </span>
                </div>

                <p className="text-sm font-semibold text-white">
                  {currentResponse.miniQuiz.question}
                </p>

                <div className="space-y-2">
                  {currentResponse.miniQuiz.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === currentResponse.miniQuiz.correctIndex;
                    let optionStyle =
                      'bg-slate-900 border-slate-800 hover:border-indigo-500 text-slate-300';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-indigo-600/30 border-indigo-500 text-white';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed font-medium ${
                      selectedQuizOption === currentResponse.miniQuiz.correctIndex
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                        : 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
                    }`}
                  >
                    {selectedQuizOption === currentResponse.miniQuiz.correctIndex ? (
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>Spot on! +20 XP added to your streak!</span>
                      </div>
                    ) : (
                      <div className="font-bold mb-1">Not quite, but great try!</div>
                    )}
                    {currentResponse.miniQuiz.explanation}
                  </div>
                )}
              </div>
            )}

            {/* 7. Follow Up Exploration Pathways */}
            {currentResponse.followUpQuestions && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Continue Learning Journey:</span>
                <div className="flex flex-wrap gap-2">
                  {currentResponse.followUpQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuestionInput(q);
                        handleAsk(q);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300 text-xs transition-all text-left"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
