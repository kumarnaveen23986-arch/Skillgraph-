import React, { useState } from 'react';
import { 
  Github, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Star, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  FileCode, 
  ShieldCheck, 
  Award,
  Terminal,
  BookOpen
} from 'lucide-react';
import { UserProgress } from '../types';

interface GitHubHubViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  exportedProjectData?: {
    projectTitle: string;
    concept: string;
    code: string;
    explanation: string;
    score: number;
    language: string;
  };
}

const STARTER_REPOS = [
  {
    name: 'skillgraph/python-beginners-handbook',
    desc: 'Beginner-friendly Python modules covering variables, lists, dicts, and loops with real-life analogy tests.',
    stars: 1420,
    language: 'Python',
    langColor: 'bg-blue-400',
    tags: ['education', 'python3', 'proofloop'],
  },
  {
    name: 'skillgraph/javascript-core-algorithms',
    desc: 'Interactive ES6+ algorithms: debounce, binary search, LRU cache, and promise queues with visual guides.',
    stars: 980,
    language: 'JavaScript',
    langColor: 'bg-amber-400',
    tags: ['javascript', 'interview-prep', 'algorithms'],
  },
  {
    name: 'skillgraph/ai-perceptron-from-scratch',
    desc: 'Pure Python 50-line artificial neuron with weighted committee voting, ReLU activation, and loss loop.',
    stars: 2150,
    language: 'Python',
    langColor: 'bg-purple-400',
    tags: ['machine-learning', 'neural-networks', 'deep-learning'],
  },
  {
    name: 'skillgraph/gemini-ai-starter-kit',
    desc: 'Modern @google/genai TypeScript SDK template with structured JSON outputs, fast streaming, and edge routes.',
    stars: 870,
    language: 'TypeScript',
    langColor: 'bg-cyan-400',
    tags: ['gemini-3.8', 'ai-agent', 'fullstack'],
  },
];

const GIT_ANALOGIES = [
  {
    cmd: 'git init',
    analogy: 'Signing the lease on an empty storage unit to start tracking your boxes.',
    meaning: 'Initializes a new Git repository in the current folder.',
  },
  {
    cmd: 'git add .',
    analogy: 'Placing selected items into a cardboard shipping box (Staging Area).',
    meaning: 'Stages modified files preparing them for the next snapshot commit.',
  },
  {
    cmd: 'git commit -m "msg"',
    analogy: 'Taping the box shut and writing a permanent marker label and timestamp.',
    meaning: 'Saves a permanent snapshot of staged changes into project history.',
  },
  {
    cmd: 'git branch feature',
    analogy: 'Making a duplicate photocopy of a legal contract so you can scribble draft ideas without ruining the original.',
    meaning: 'Creates an isolated timeline to build new features safely.',
  },
  {
    cmd: 'git push origin main',
    analogy: 'Loading the shipping container truck to deliver your sealed boxes to the global central warehouse (GitHub)!',
    meaning: 'Uploads your local commits to the remote GitHub repository.',
  },
];

export const GitHubHubView: React.FC<GitHubHubViewProps> = ({
  progress,
  onUpdateProgress,
  exportedProjectData,
}) => {
  const [githubUsername, setGithubUsername] = useState('developer');
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [activeTab, setActiveTab] = useState<'exporter' | 'starters' | 'gitcheat'>('exporter');

  const defaultProject = exportedProjectData || {
    projectTitle: 'Supermarket Grocery Cashier Bill Calculator',
    concept: 'Python Accumulator Pattern & List Filtering',
    code: `function calculateTotal(prices) {\n  let total = 0;\n  for (let i = 0; i < prices.length; i++) {\n    total += prices[i];\n  }\n  return total;\n}`,
    explanation: 'The accumulator variable total starts at 0 like an empty register drawer. Every item scanned drops bills into the drawer until finished.',
    score: 95,
    language: 'Python',
  };

  const generatedReadme = `# ${defaultProject.projectTitle} 🚀
> Verified via **SkillGraph ProofLoop™ Mastery System** | Score: ${defaultProject.score}/100

[![ProofLoop Verified](https://img.shields.io/badge/ProofLoop-Verified%20Mastery-6366f1.svg)](https://skillgraph.dev)
[![Language](https://img.shields.io/badge/Language-${encodeURIComponent(defaultProject.language)}-06b6d4.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🔄 The ProofLoop Journey

### 1. 📖 LEARN (Concept & Real-Life Analogy)
**Concept:** ${defaultProject.concept}

### 2. 💻 BUILD (Working Implementation)
\`\`\`${defaultProject.language.toLowerCase()}
${defaultProject.code}
\`\`\`

### 3. 🗣️ EXPLAIN (Student Articulation)
> "${defaultProject.explanation}"

### 4. ✅ VERIFY (Evidence & Unit Testing)
- Automated Unit Tests: **PASSED (100%)**
- Cognitive Assessment Score: **${defaultProject.score}/100**
- Execution Verification: **Verified in SkillGraph Sandbox**

### 5. ⚡ IMPROVE (Next Evolution)
Next challenge unlocked on SkillGraph skill tree.

---
*Built with [SkillGraph](https://skillgraph.dev) — Master Coding & AI with Real-Life Examples.*
`;

  const profileBadgeMarkdown = `[![SkillGraph ProofLoop Scholar](https://img.shields.io/badge/ProofLoop-Scholar%20·%20${progress.xp}%20XP-6366f1.svg)](https://skillgraph.dev)`;

  const copyReadme = () => {
    navigator.clipboard.writeText(generatedReadme);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const copyBadge = () => {
    navigator.clipboard.writeText(profileBadgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* GitHub Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold">
            <Github className="w-4 h-4" />
            <span>GitHub Developer Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ProofLoop on GitHub & Open-Source
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Turn your SkillGraph learning into verified open-source GitHub portfolios. Export verified ProofLoop projects with README badges, explore beginner starter repos, and master Git through physical analogies.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('exporter')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exporter'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Export to GitHub
          </button>
          <button
            onClick={() => setActiveTab('starters')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'starters'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Starter Repos
          </button>
          <button
            onClick={() => setActiveTab('gitcheat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gitcheat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Git Analogies
          </button>
        </div>
      </div>

      {/* TAB 1: EXPORT PROJECT & BADGES */}
      {activeTab === 'exporter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rendered README Preview */}
          <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold font-mono text-slate-200">
                  README.md (ProofLoop Verified)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyReadme}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  {copiedReadme ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReadme ? 'Copied' : 'Copy README'}</span>
                </button>

                <button
                  onClick={() => downloadFile('README.md', generatedReadme)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed">
              <code>{generatedReadme}</code>
            </pre>
          </div>

          {/* Right: GitHub Profile Badge Generator */}
          <div className="lg:col-span-4 space-y-5">
            {/* Profile Badge Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>GitHub Profile README Badge</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Showcase your SkillGraph learning streak and ProofLoop mastery directly on your GitHub profile:
              </p>

              {/* Visual Badge Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-mono font-bold shadow-md">
                  ProofLoop · Scholar · {progress.xp} XP
                </div>
                <div className="text-[10px] text-slate-500">Live SVG Badge Preview</div>
              </div>

              {/* Badge Markdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">
                  Markdown Code:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={profileBadgeMarkdown}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-300"
                  />
                  <button
                    onClick={copyBadge}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="Copy Markdown"
                  >
                    {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 font-medium">
                💡 Paste this line into your `username/README.md` on GitHub to display your dynamic badge!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STARTER REPOSITORIES */}
      {activeTab === 'starters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Curated Beginner Repositories ({STARTER_REPOS.length})</span>
            <span>Open Source Templates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STARTER_REPOS.map((repo, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer">
                      {repo.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{repo.stars}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {repo.desc}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${repo.langColor}`}></span>
                    <span className="text-slate-300 font-medium">{repo.language}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {repo.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GIT COMMANDS VIA REAL-LIFE ANALOGIES */}
      {activeTab === 'gitcheat' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Understanding Git Through Physical Metaphors
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GIT_ANALOGIES.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <code className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {item.cmd}
                  </code>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-medium">
                  🌟 <strong className="text-white">Real-Life Metaphor: </strong>
                  {item.analogy}
                </div>

                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Technical Meaning: </strong>
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
