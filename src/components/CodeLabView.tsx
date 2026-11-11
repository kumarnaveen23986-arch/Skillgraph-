import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Code2, 
  Terminal, 
  Award, 
  Wand2, 
  HelpCircle,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CURATED_EXERCISES } from '../data/curatedExercises';
import { DifficultyLevel, Exercise, LanguageTone, UserProgress } from '../types';
import { runCodeWithTests, RunResult } from '../utils/codeRunner';
import { recordLessonCompletion } from '../utils/streakManager';

interface CodeLabViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  languageTone: LanguageTone;
  initialExerciseId?: string;
  injectedCode?: string;
}

export const CodeLabView: React.FC<CodeLabViewProps> = ({
  progress,
  onUpdateProgress,
  languageTone,
  initialExerciseId,
  injectedCode,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>(CURATED_EXERCISES);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  
  const [activeExercise, setActiveExercise] = useState<Exercise>(() => {
    if (initialExerciseId) {
      const found = CURATED_EXERCISES.find((e) => e.id === initialExerciseId);
      if (found) return found;
    }
    return CURATED_EXERCISES[0];
  });

  const [userCode, setUserCode] = useState<string>(() => {
    if (injectedCode) return injectedCode;
    return activeExercise.starterCode;
  });

  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  // AI Hint state
  const [hintLoading, setHintLoading] = useState(false);
  const [aiHint, setAiHint] = useState<{
    analogyClue: string;
    hint: string;
    focusArea: string;
    encouragement: string;
  } | null>(null);

  // Custom AI Exercise Generator Modal/State
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [customDiff, setCustomDiff] = useState<DifficultyLevel>('Beginner');

  // Handle external selection
  useEffect(() => {
    if (initialExerciseId) {
      const match = exercises.find((e) => e.id === initialExerciseId);
      if (match) {
        setActiveExercise(match);
        setUserCode(match.starterCode);
        setRunResult(null);
        setShowSolution(false);
        setAiHint(null);
      }
    }
  }, [initialExerciseId, exercises]);

  // When active exercise changes
  const switchExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setUserCode(ex.starterCode);
    setRunResult(null);
    setShowSolution(false);
    setAiHint(null);
  };

  const filteredExercises = exercises.filter((e) => {
    if (selectedDifficulty === 'all') return true;
    return e.difficulty === selectedDifficulty;
  });

  const isCompleted = (id: string) => progress.completedExercises.includes(id);

  // Execute Code and Test Cases
  const handleRunTests = async () => {
    setIsRunning(true);
    setAiHint(null);

    const result = await runCodeWithTests(userCode, activeExercise.testCases);
    setRunResult(result);
    setIsRunning(false);

    if (result.allPassed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });

      const { updatedProgress } = recordLessonCompletion(
        progress,
        activeExercise.id,
        activeExercise.xpReward,
        activeExercise.title
      );
      onUpdateProgress(updatedProgress);
    }
  };

  // Get Socratic AI Hint
  const handleGetAIHint = async () => {
    setHintLoading(true);
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseTitle: activeExercise.title,
          problemDescription: activeExercise.instructions,
          userCode,
          testResults: runResult?.testResults || 'Not run yet',
          languageTone,
        }),
      });

      if (!res.ok) {
        throw new Error('Hint request failed');
      }

      const data = await res.json();
      setAiHint(data);
    } catch {
      // Fallback to static hint
      setAiHint({
        analogyClue: activeExercise.solutionAnalogy || 'Think of it step-by-step',
        hint: activeExercise.hints[0] || 'Check your loop termination and return statement.',
        focusArea: 'Return value or accumulator logic',
        encouragement: 'You are so close! Try logging values with console.log to inspect each step.',
      });
    } finally {
      setHintLoading(false);
    }
  };

  // Generate Custom Exercise via Gemini
  const handleGenerateCustomExercise = async () => {
    if (!customTopic.trim()) return;
    setIsGeneratingCustom(true);
    try {
      const res = await fetch('/api/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          difficulty: customDiff,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const newEx = await res.json();
      const formatted: Exercise = {
        id: `custom-${Date.now()}`,
        title: newEx.title || `Custom: ${customTopic}`,
        category: customTopic,
        difficulty: customDiff,
        track: 'coding-foundations',
        language: 'JavaScript',
        realLifeStory: newEx.story || 'Real-life scenario',
        instructions: newEx.instructions || 'Follow the instructions',
        starterCode: newEx.starterCode || 'function solve() {\n  \n}',
        solutionCode: newEx.solutionCode || '',
        solutionAnalogy: newEx.solutionExplanation || '',
        testCases: newEx.testCases || [],
        hints: ['Break problem down into sub-steps.'],
        xpReward: 100,
      };

      setExercises((prev) => [formatted, ...prev]);
      switchExercise(formatted);
      setCustomTopic('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Allow tab key indentation in editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextCode = userCode.substring(0, start) + '  ' + userCode.substring(end);
      setUserCode(nextCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              Interactive Sandbox
            </span>
            <span className="text-xs text-slate-400">
              {progress.completedExercises.length} of {exercises.length} Exercises Solved
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SkillGraph Code Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Write real JavaScript in the browser. Test each case live, get Socratic AI hints, and earn XP!
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>

          {/* Generate Custom AI Exercise Trigger */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Generate custom challenge (e.g. AI token counter)..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52 sm:w-64"
            />
            <button
              onClick={handleGenerateCustomExercise}
              disabled={isGeneratingCustom || !customTopic.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGeneratingCustom ? 'Generating...' : 'AI Generate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Lab Layout: Sidebar List + Editor & Testing Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Exercise List */}
        <div className="lg:col-span-4 space-y-2 max-h-[820px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Exercises ({filteredExercises.length})</span>
            <span>Reward</span>
          </div>

          <div className="space-y-2">
            {filteredExercises.map((ex) => {
              const active = activeExercise.id === ex.id;
              const completed = isCompleted(ex.id);

              return (
                <div
                  key={ex.id}
                  onClick={() => switchExercise(ex)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0"></span>
                        )}
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            active ? 'text-indigo-300' : 'text-slate-200'
                          }`}
                        >
                          {ex.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 pl-6">
                        <span
                          className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                            ex.difficulty === 'Beginner'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : ex.difficulty === 'Intermediate'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {ex.difficulty}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {ex.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">
                      <span>+{ex.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Challenge Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* Real-Life Context Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    activeExercise.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : activeExercise.difficulty === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {activeExercise.difficulty}
                </span>
                <h2 className="text-lg font-extrabold text-white">
                  {activeExercise.title}
                </h2>
              </div>

              {isCompleted(activeExercise.id) && (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </div>
              )}
            </div>

            {/* Physical Real Life Scenario */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-medium">
              🌟 <strong className="text-white">Real-Life Scenario: </strong>
              {activeExercise.realLifeStory}
            </div>

            {/* Step-by-step Instructions */}
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <span className="font-bold text-white block mb-1">🎯 Your Task:</span>
              <p className="whitespace-pre-line">{activeExercise.instructions}</p>
            </div>
          </div>

          {/* Code Editor Header */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/60 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block"></span>
                </div>
                <span className="text-xs font-mono text-slate-400 pl-2">solution.js</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Reset button */}
                <button
                  onClick={() => {
                    setUserCode(activeExercise.starterCode);
                    setRunResult(null);
                    setAiHint(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Reset code to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Show/Hide Solution */}
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  {showSolution ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Solution</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Peek Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Textarea Code Editor */}
            <div className="relative">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-64 p-4 bg-transparent font-mono text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-indigo-500/30"
              />
            </div>

            {/* Run & AI Hint Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/60 border-t border-slate-800">
              {/* AI Socratic Hint Button */}
              <button
                onClick={handleGetAIHint}
                disabled={hintLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>{hintLoading ? 'Asking AI Doctor...' : 'Get AI Socratic Hint'}</span>
              </button>

              {/* Run Code Button */}
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isRunning ? 'Running Tests...' : 'Run All Test Cases'}</span>
              </button>
            </div>
          </div>

          {/* AI Hint Drawer */}
          {aiHint && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Tutor Clue: {aiHint.analogyClue}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                💡 {aiHint.hint}
              </p>
              <div className="text-[11px] text-amber-400/90 font-mono">
                Inspect: {aiHint.focusArea}
              </div>
              <div className="text-[11px] text-slate-400 italic">
                ✨ {aiHint.encouragement}
              </div>
            </div>
          )}

          {/* Solution Drawer */}
          {showSolution && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                <span>Reference Solution:</span>
                <span className="text-[11px] text-indigo-400">Try writing it in your own words!</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
                <code>{activeExercise.solutionCode}</code>
              </pre>
              <p className="text-xs text-slate-300 leading-relaxed">
                🧠 <strong className="text-indigo-300">Why this works: </strong>
                {activeExercise.solutionAnalogy}
              </p>
            </div>
          )}

          {/* Test Results & Console Output Panel */}
          {runResult && (
            <div className="space-y-4">
              {/* Summary Bar */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  runResult.allPassed
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {runResult.allPassed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold">
                      {runResult.allPassed
                        ? '🎉 All Test Cases Passed!'
                        : 'Some Test Cases Failed'}
                    </h3>
                    <p className="text-xs opacity-90">
                      {runResult.allPassed
                        ? `Awesome job! You mastered this challenge and earned +${activeExercise.xpReward} XP!`
                        : 'Review the actual vs expected outputs below or tap "Get AI Socratic Hint".'}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold opacity-80">
                  {runResult.executionTimeMs}ms
                </div>
              </div>

              {/* Test Cases Table */}
              {runResult.testResults.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-400">
                    Test Results Breakdown
                  </div>
                  <div className="divide-y divide-slate-800/80 text-xs">
                    {runResult.testResults.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {tc.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-200">
                              {tc.inputDescription}
                            </span>
                          </div>
                          {tc.error && (
                            <p className="text-rose-400 font-mono text-[11px] pl-6">
                              Error: {tc.error}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 pl-6 sm:pl-0 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500">Expected: </span>
                            <span className="text-emerald-400">{tc.expectedOutput}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Actual: </span>
                            <span
                              className={
                                tc.passed ? 'text-emerald-400' : 'text-rose-400 font-bold'
                              }
                            >
                              {tc.actualOutput}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Console Logs Terminal */}
              {runResult.logs.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pb-1 border-b border-slate-800">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Console Standard Output:</span>
                  </div>
                  {runResult.logs.map((log, i) => (
                    <div key={i} className="text-cyan-300">
                      &gt; {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
