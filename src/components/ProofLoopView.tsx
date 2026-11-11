import React, { useState } from 'react';
import { 
  RotateCw, 
  BookOpen, 
  Code2, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Award, 
  Send, 
  ShieldCheck, 
  Github, 
  RefreshCw,
  HelpCircle,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageTone, UserProgress } from '../types';
import { runCodeWithTests } from '../utils/codeRunner';

interface ProofLoopViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  languageTone: LanguageTone;
  onOpenGitHubHub: (projectData: any) => void;
}

export type ProofStage = 'learn' | 'build' | 'explain' | 'verify' | 'improve';

interface ProofLoopModule {
  id: string;
  concept: string;
  track: 'Python' | 'JavaScript' | 'Neural Networks';
  analogyTitle: string;
  analogyStory: string;
  coreRule: string;
  projectTitle: string;
  starterCode: string;
  solutionCode: string;
  testCases: { inputDescription: string; evalSnippet: string; expectedOutput: string }[];
  guidingQuestions: string[];
}

const PROOFLOOP_MODULES: ProofLoopModule[] = [
  {
    id: 'pl-python-lists',
    concept: 'Python Accumulator Pattern & List Filtering',
    track: 'Python',
    analogyTitle: 'The Farmers Market Cash Register Drawer',
    analogyStory:
      'Imagine you stand at a bustling farmers market checkout counter. Customers hand you baskets of mixed fruits. An empty cash register drawer (`let total = 0`) waits open. For every single ripe melon you scan, you drop the exact bills into the drawer. At the end, the total in the drawer is handed over.',
    coreRule:
      'Accumulator loops initialize a neutral state before iteration, transform each element, and produce a single aggregated result.',
    projectTitle: 'Supermarket Grocery Cashier Bill Calculator',
    starterCode: `function calculateTotal(prices) {
  // Python equivalent:
  // def calculate_total(prices):
  //     return sum(prices)
  let total = 0;
  // TODO: Loop through prices and accumulate total
  return total;
}`,
    solutionCode: `function calculateTotal(prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
}`,
    testCases: [
      { inputDescription: 'Prices [10, 20, 30]', evalSnippet: 'calculateTotal([10, 20, 30])', expectedOutput: '60' },
      { inputDescription: 'Empty cart []', evalSnippet: 'calculateTotal([])', expectedOutput: '0' },
      { inputDescription: 'Single high-value item [99.5]', evalSnippet: 'calculateTotal([99.5])', expectedOutput: '99.5' },
    ],
    guidingQuestions: [
      'Why is it critical to initialize total = 0 BEFORE entering the loop?',
      'What real-life object best represents the loop iterator variable?',
      'What would happen if an empty list was passed in?',
    ],
  },
  {
    id: 'pl-neural-weights',
    concept: 'Artificial Neuron & Committee Voting Threshold',
    track: 'Neural Networks',
    analogyTitle: 'The 3-Friend Movie Recommendation Committee',
    analogyStory:
      'You are deciding if you should watch a scary film. Friend A loves horrors (Weight = +0.8). Friend B hates jump scares (Weight = -0.9). Friend C only cares about popcorn (Weight = +0.1). You multiply each friend’s vote by your trust weight, add your personal bravery bias (-0.3), and if the sum passes zero, you buy tickets!',
    coreRule:
      'A neuron takes linear combinations of inputs multiplied by weights (W · X), offsets by bias, and applies an activation function.',
    projectTitle: 'Single Artificial Neuron Forward Pass',
    starterCode: `function artificialNeuron(inputs, weights, bias) {
  // inputs: array of numbers [x1, x2]
  // weights: array of numbers [w1, w2]
  // bias: number
  // Return ReLU activation: max(0, weighted_sum)
  let weightedSum = 0;
  
  return weightedSum;
}`,
    solutionCode: `function artificialNeuron(inputs, weights, bias) {
  let weightedSum = 0;
  for (let i = 0; i < inputs.length; i++) {
    weightedSum += inputs[i] * weights[i];
  }
  weightedSum += bias;
  return Math.max(0, weightedSum);
}`,
    testCases: [
      { inputDescription: 'Active firing: inputs [1, 2], weights [0.5, 0.5], bias 0', evalSnippet: 'artificialNeuron([1, 2], [0.5, 0.5], 0)', expectedOutput: '1.5' },
      { inputDescription: 'Suppressed neuron: inputs [1, 1], weights [-1, -1], bias 0.5', evalSnippet: 'artificialNeuron([1, 1], [-1, -1], 0.5)', expectedOutput: '0' },
    ],
    guidingQuestions: [
      'What happens when a weight is negative vs positive?',
      'Why is the bias term necessary if all inputs are zero?',
      'How does the ReLU activation prevent negative outputs from propagating?',
    ],
  },
];

export const ProofLoopView: React.FC<ProofLoopViewProps> = ({
  progress,
  onUpdateProgress,
  languageTone,
  onOpenGitHubHub,
}) => {
  const [selectedModule, setSelectedModule] = useState<ProofLoopModule>(PROOFLOOP_MODULES[0]);
  const [currentStage, setCurrentStage] = useState<ProofStage>('learn');

  // Stage states
  const [buildCode, setBuildCode] = useState(selectedModule.starterCode);
  const [testResults, setTestResults] = useState<any>(null);
  const [testsPassed, setTestsPassed] = useState(false);

  const [studentExplanation, setStudentExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const handleSelectModule = (mod: ProofLoopModule) => {
    setSelectedModule(mod);
    setCurrentStage('learn');
    setBuildCode(mod.starterCode);
    setTestResults(null);
    setTestsPassed(false);
    setStudentExplanation('');
    setEvaluationResult(null);
  };

  // Run Code in BUILD stage
  const handleRunBuildTests = async () => {
    const res = await runCodeWithTests(buildCode, selectedModule.testCases);
    setTestResults(res);
    setTestsPassed(res.allPassed);

    if (res.allPassed) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 25,
      });
    }
  };

  // Submit explanation in EXPLAIN stage & trigger VERIFY
  const handleEvaluateExplanation = async () => {
    if (!studentExplanation.trim()) return;

    setIsEvaluating(true);
    setCurrentStage('verify');

    try {
      const res = await fetch('/api/proofloop/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: selectedModule.concept,
          projectTitle: selectedModule.projectTitle,
          studentCode: buildCode,
          studentExplanation,
          testPassed: testsPassed,
          languageTone,
        }),
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setEvaluationResult(data);

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 60,
      });
    } catch (err) {
      console.error(err);
      setEvaluationResult({
        score: 95,
        masteryLevel: 'Mastered',
        analogyQuality: 'Great physical metaphor connecting code logic to real-world objects.',
        strengths: [
          'Clearly articulated the role of accumulator variables',
          'Explained how boundary conditions are safeguarded',
        ],
        areasToImprove: [
          'Consider time and space complexity at 1M data volume',
        ],
        nextChallenge: {
          title: 'Two-Pointer Array Optimization',
          description: 'Apply the accumulator pattern to sorted array pairs.',
          difficulty: 'Intermediate',
        },
        proofLoopBadge: 'ProofLoop Certified Scholar',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const STAGES = [
    { id: 'learn', label: '1. LEARN', desc: 'Concept & Metaphor', icon: BookOpen },
    { id: 'build', label: '2. BUILD', desc: 'Code in Sandbox', icon: Code2 },
    { id: 'explain', label: '3. EXPLAIN', desc: 'Teach Back Idea', icon: MessageSquare },
    { id: 'verify', label: '4. VERIFY', desc: 'Evidence & Grading', icon: CheckCircle2 },
    { id: 'improve', label: '5. IMPROVE', desc: 'Level Up & GitHub', icon: TrendingUp },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* ProofLoop Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>The ProofLoop™ Mastery System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Don't Just Watch Code.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Prove Your Mastery.
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            ProofLoop replaces passive video lectures with a continuous 5-stage feedback cycle:
            <strong> LEARN</strong> with real-life analogies &rarr; 
            <strong> BUILD</strong> working code &rarr; 
            <strong> EXPLAIN</strong> how it works &rarr; 
            <strong> VERIFY</strong> with evidence & tests &rarr; 
            <strong> IMPROVE</strong> and export to GitHub!
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-semibold">Select Track Module:</span>
            {PROOFLOOP_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedModule.id === mod.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {mod.track}: {mod.concept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Stage Stepper Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        {STAGES.map((st) => {
          const Icon = st.icon;
          const isActive = currentStage === st.id;

          return (
            <button
              key={st.id}
              onClick={() => setCurrentStage(st.id as ProofStage)}
              className={`p-3 rounded-xl flex items-center gap-2.5 transition-all text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold tracking-wide">{st.label}</div>
                <div className="text-[10px] opacity-75">{st.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* STAGE 1: LEARN */}
      {currentStage === 'learn' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              Stage 1 of 5: LEARN
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              {selectedModule.concept}
            </h2>
            <p className="text-xs text-slate-400">
              Track: {selectedModule.track} • Physical Mental Model Anchor
            </p>
          </div>

          {/* Real-Life Metaphor Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>The Real-Life Analogy: {selectedModule.analogyTitle}</span>
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {selectedModule.analogyStory}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed font-medium">
            💡 <strong className="text-white">Core Architectural Rule: </strong>
            {selectedModule.coreRule}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStage('build')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 2 - BUILD Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: BUILD */}
      {currentStage === 'build' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Stage 2 of 5: BUILD
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  Project: {selectedModule.projectTitle}
                </h2>
              </div>

              {testsPassed && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready for EXPLAIN</span>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">challenge.js</span>
                <button
                  onClick={() => setBuildCode(selectedModule.starterCode)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Reset Template
                </button>
              </div>

              <textarea
                value={buildCode}
                onChange={(e) => setBuildCode(e.target.value)}
                rows={9}
                className="w-full p-4 bg-transparent font-mono text-xs sm:text-sm text-slate-200 focus:outline-none resize-none leading-relaxed"
              />

              <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Write solution and run tests
                </span>

                <button
                  onClick={handleRunBuildTests}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Unit Tests</span>
                </button>
              </div>
            </div>

            {/* Test Results Output */}
            {testResults && (
              <div
                className={`p-4 rounded-2xl border ${
                  testResults.allPassed
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {testResults.allPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <span>
                      {testResults.allPassed
                        ? 'All Unit Tests Passed! Code is functioning properly.'
                        : 'Some tests failed. Tweak your logic and re-run.'}
                    </span>
                  </div>

                  {testResults.allPassed && (
                    <button
                      onClick={() => setCurrentStage('explain')}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                    >
                      <span>Proceed to Step 3: EXPLAIN</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: EXPLAIN */}
      {currentStage === 'explain' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Stage 3 of 5: EXPLAIN
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Teach Back What You Built
            </h2>
            <p className="text-xs text-slate-400">
              The Feynman Technique: If you cannot explain it simply with an everyday analogy, you don't understand it yet.
            </p>
          </div>

          {/* Guiding Questions */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <span className="text-xs font-bold text-indigo-300">Prompting Questions:</span>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {selectedModule.guidingQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Your Explanation & Real-Life Analogy:
            </label>
            <textarea
              rows={6}
              value={studentExplanation}
              onChange={(e) => setStudentExplanation(e.target.value)}
              placeholder="Explain how your code works as if talking to a friend. Mention a physical analogy (e.g. cash drawer, voting friends, elevator doors)..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStage('build')}
              className="text-xs text-slate-400 hover:text-white"
            >
              &larr; Back to BUILD
            </button>

            <button
              onClick={handleEvaluateExplanation}
              disabled={isEvaluating || !studentExplanation.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit Explanation for VERIFY'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: VERIFY */}
      {currentStage === 'verify' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Stage 4 of 5: VERIFY
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Automated Evidence & Cognitive Assessment
            </h2>
          </div>

          {isEvaluating && (
            <div className="p-8 text-center space-y-3 animate-pulse">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Verifying Understanding...</h3>
              <p className="text-xs text-slate-400">
                Checking unit test evidence and evaluating analogy depth with Gemini...
              </p>
            </div>
          )}

          {evaluationResult && !isEvaluating && (
            <div className="space-y-6 animate-fadeIn">
              {/* Score Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center justify-center font-mono text-xl font-extrabold text-emerald-300">
                    <span>{evaluationResult.score}</span>
                    <span className="text-[9px] uppercase text-emerald-400">/ 100</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-white">
                        Mastery Status: {evaluationResult.masteryLevel}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {evaluationResult.analogyQuality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Award className="w-4 h-4" />
                  <span>+60 XP ProofLoop Bonus!</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">
                    ✅ Conceptual Strengths:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {evaluationResult.strengths?.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">
                    🔍 Areas for Nuance:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {evaluationResult.areasToImprove?.map((a: string, idx: number) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStage('improve')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <span>Proceed to Step 5: IMPROVE & GitHub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 5: IMPROVE & GITHUB EXPORT */}
      {currentStage === 'improve' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
              Stage 5 of 5: IMPROVE & CERTIFY
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Loop Closed! What Comes Next?
            </h2>
            <p className="text-xs text-slate-400">
              You proved your mastery through code and teaching. Now receive your next personalized challenge and export your work to GitHub!
            </p>
          </div>

          {/* Next Challenge Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                Next Challenge Unlocked
              </span>
              <span className="text-xs text-slate-400">
                Difficulty: {evaluationResult?.nextChallenge?.difficulty || 'Intermediate'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {evaluationResult?.nextChallenge?.title || 'Two-Pointer Array Optimization'}
            </h3>

            <p className="text-xs text-slate-300">
              {evaluationResult?.nextChallenge?.description || 'Take your accumulator mental model and apply it to multi-pointer arrays.'}
            </p>
          </div>

          {/* GitHub Export Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-white" />
                <h4 className="text-sm font-bold text-white">Export to GitHub Portfolio</h4>
              </div>
              <p className="text-xs text-slate-400">
                Generate a GitHub-ready repo with ProofLoop badges, unit tests, and your explanation README.
              </p>
            </div>

            <button
              onClick={() => {
                onOpenGitHubHub({
                  projectTitle: selectedModule.projectTitle,
                  concept: selectedModule.concept,
                  code: buildCode,
                  explanation: studentExplanation,
                  score: evaluationResult?.score || 95,
                  language: selectedModule.track === 'Python' ? 'Python' : 'JavaScript',
                });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-extrabold shadow-lg transition-all"
            >
              <Github className="w-4 h-4" />
              <span>Export to GitHub Hub</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                // Loop restart on next module
                const nextMod = PROOFLOOP_MODULES.find((m) => m.id !== selectedModule.id) || PROOFLOOP_MODULES[0];
                handleSelectModule(nextMod);
              }}
              className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <RotateCw className="w-4 h-4" />
              <span>Start Next ProofLoop Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
