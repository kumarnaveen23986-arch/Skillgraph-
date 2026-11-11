import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Video, 
  Network, 
  Sparkles, 
  Code2, 
  Film, 
  Brain, 
  MessageSquare, 
  Stethoscope, 
  Globe, 
  RefreshCw, 
  Award, 
  ArrowRight, 
  Command, 
  User, 
  Crown,
  BookOpen,
  Terminal,
  Zap,
  CornerDownLeft,
  Home,
  Activity,
  FolderGit2,
  WifiOff
} from 'lucide-react';
import { CURATED_EXERCISES } from '../data/curatedExercises';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudio: (tab: string) => void;
  onSelectExercise: (exerciseId: string) => void;
  onTriggerAI: (query: string, tool: 'ask' | 'bugdoctor' | 'grok' | 'flowai') => void;
  onOpenProfile?: () => void;
  isCeoAuthenticated?: boolean;
  onOpenOfflineModules?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectStudio,
  onSelectExercise,
  onTriggerAI,
  onOpenProfile,
  isCeoAuthenticated = false,
  onOpenOfflineModules,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const STUDIOS = [
    { id: 'home', name: 'SkillGraph Super App Home', desc: 'Overview, daily streak flame, quick studios', icon: Home, color: 'text-indigo-400', category: 'Navigation' },
    { id: 'offline-modules', name: 'Cached Completed Modules (Offline Ready)', desc: 'Browse lesson summaries, core concepts and run code without internet', icon: WifiOff, color: 'text-amber-400', category: 'Offline' },
    { id: 'courses', name: 'Indian Creator Video Courses', desc: 'Chai aur Code, CodeWithHarry, Kunal Kushwaha', icon: Video, color: 'text-red-400', category: 'Studios' },
    { id: 'aitools', name: 'AI Tools & Creator Engine', desc: 'Gemini, GPT, Grok, Flow AI & Trending Effects', icon: Sparkles, color: 'text-amber-400', category: 'Studios' },
    { id: 'activity', name: 'Learner Activity Dashboard', desc: 'Study hours, weekly rhythm, XP & milestones', icon: Activity, color: 'text-emerald-400', category: 'Navigation' },
    { id: 'profile', name: 'Live Code Injector (Gemini 3.8 Flash Applier)', desc: 'Paste Gemini 3.8 Flash code to apply live CSS, JS, HTML and Config changes in Advanced Settings', icon: Code2, color: 'text-cyan-400', category: 'Settings' },
    { id: 'profile', name: 'User Profile & Advanced Settings', desc: 'Hobby usernames, skills, goals & live code customizer', icon: User, color: 'text-cyan-400', category: 'Navigation' },
    { id: 'workspace', name: 'Google Workspace Hub', desc: '1P Google Drive files & Gmail communication', icon: FolderGit2, color: 'text-blue-400', category: 'Studios' },
    { id: 'graph', name: 'Interactive Skill Graph', desc: 'Visual prerequisites tree and curriculum roadmaps', icon: Network, color: 'text-indigo-400', category: 'Studios' },
    { id: 'ask', name: 'Ask AI Teacher', desc: 'Socratic mentor with real-life physical analogies', icon: Sparkles, color: 'text-amber-400', category: 'Studios' },
    { id: 'codelab', name: 'Code Lab Sandbox', desc: 'Live JavaScript & Python runner with automated tests', icon: Code2, color: 'text-cyan-400', category: 'Studios' },
    { id: 'flowai', name: 'Flow AI Video Generator', desc: 'Prompt to 10s cinematic AI video simulation', icon: Film, color: 'text-pink-400', category: 'Studios' },
    { id: 'grok', name: 'Grok AI Reasoning Engine', desc: 'Think Mode & Unhinged real first-principles breakdown', icon: Brain, color: 'text-cyan-300', category: 'Studios' },
    { id: 'chatgpt', name: 'ChatGPT GPTs Studio', desc: 'Dedicated AI models for coding, resume, algorithms', icon: MessageSquare, color: 'text-emerald-400', category: 'Studios' },
    { id: 'bugdoctor', name: '24/7 AI Bug Doctor', desc: 'Diagnose runtime errors with physical analogies', icon: Stethoscope, color: 'text-rose-400', category: 'Studios' },
    { id: 'webstudio', name: 'AI Web Dev Studio', desc: 'Generate complete HTML/Tailwind web apps like AI Studio', icon: Globe, color: 'text-indigo-300', category: 'Studios' },
    { id: 'proofloop', name: 'ProofLoop™ Verification Lab', desc: '5-Stage mastery: LEARN -> BUILD -> EXPLAIN -> VERIFY', icon: RefreshCw, color: 'text-purple-400', category: 'Studios' },
    { id: 'aicourse', name: 'Neural Networks & AI Course', desc: 'Step-by-step physical analogies for Artificial Intelligence', icon: Award, color: 'text-cyan-400', category: 'Studios' },
  ];

  // Filter Studios
  const filteredStudios = STUDIOS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.desc.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase())
  );

  // Filter Lessons & Exercises
  const filteredExercises = CURATED_EXERCISES.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.category.toLowerCase().includes(query.toLowerCase()) ||
      e.language.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  // Dynamic AI Action Items
  const aiActions = query.trim().length > 1 ? [
    {
      id: 'ai-ask',
      title: `Ask AI Teacher: "${query.trim()}"`,
      desc: 'Get an intuitive real-life analogy breakdown',
      type: 'ask' as const,
      icon: Sparkles,
      color: 'text-amber-400',
    },
    {
      id: 'ai-bug',
      title: `Diagnose in AI Bug Doctor: "${query.trim()}"`,
      desc: 'Find root-cause logic flaws and get fixed code',
      type: 'bugdoctor' as const,
      icon: Stethoscope,
      color: 'text-rose-400',
    },
    {
      id: 'ai-grok',
      title: `Run Grok Think Mode: "${query.trim()}"`,
      desc: 'Deep first-principles reasoning with thinking steps',
      type: 'grok' as const,
      icon: Brain,
      color: 'text-cyan-400',
    },
    {
      id: 'ai-video',
      title: `Generate Flow AI Video: "${query.trim()}"`,
      desc: 'Synthesize 10s cinematic simulation',
      type: 'flowai' as const,
      icon: Film,
      color: 'text-pink-400',
    },
  ] : [];

  // Flattened items for keyboard navigation
  const allNavItems = [
    ...filteredStudios.map((s) => ({ type: 'studio', ...s })),
    ...filteredExercises.map((e) => ({ type: 'exercise', id: e.id, name: e.title, desc: `${e.language} • ${e.category} (${e.difficulty})`, icon: Terminal, color: 'text-emerald-400' })),
    ...aiActions.map((a) => ({ type: 'ai', id: a.id, name: a.title, desc: a.desc, icon: a.icon, color: a.color, aiType: a.type })),
  ];

  // Reset index if out of bounds
  useEffect(() => {
    if (selectedIndex >= allNavItems.length) {
      setSelectedIndex(Math.max(0, allNavItems.length - 1));
    }
  }, [allNavItems.length]);

  const handleSelectItem = (item: any) => {
    if (!item) return;
    onClose();
    if (item.id === 'offline-modules' && onOpenOfflineModules) {
      onOpenOfflineModules();
    } else if (item.type === 'studio') {
      onSelectStudio(item.id);
    } else if (item.type === 'exercise') {
      onSelectStudio('codelab');
      onSelectExercise(item.id);
    } else if (item.type === 'ai') {
      onTriggerAI(query.trim(), item.aiType);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allNavItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allNavItems.length) % Math.max(1, allNavItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allNavItems[selectedIndex]) {
        handleSelectItem(allNavItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search studios, coding lessons, or type a query..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 max-h-96">
          {/* AI Trigger Actions (When user is searching something specific) */}
          {aiActions.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Execute Direct AI Queries</span>
              </div>
              {aiActions.map((item, idx) => {
                const itemIndex = filteredStudios.length + filteredExercises.length + idx;
                const isSelected = selectedIndex === itemIndex;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem({ ...item, aiType: item.type, type: 'ai' })}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                      isSelected
                        ? 'bg-amber-500/20 text-white border border-amber-500/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Studios & Apps Section */}
          {filteredStudios.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Studios & Applications
              </div>
              {filteredStudios.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem({ type: 'studio', ...item })}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold truncate">{item.name}</div>
                        <div className={`text-[11px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Lessons & Exercises Section */}
          {filteredExercises.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Coding Lessons & Practice Challenges</span>
              </div>
              {filteredExercises.map((ex, idx) => {
                const itemIndex = filteredStudios.length + idx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectItem({ type: 'exercise', id: ex.id })}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold truncate">{ex.title}</div>
                        <div className={`text-[11px] truncate ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {ex.language} • {ex.category} ({ex.difficulty})
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0 ml-2">
                      +{ex.xpReward} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {allNavItems.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-400">No results found for "{query}"</div>
              <p className="text-xs text-slate-500">Try searching for "python", "neural network", "grok", or "flow ai".</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Tips */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-950/90 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span><strong className="text-slate-300">↑↓</strong> Navigate</span>
            <span><strong className="text-slate-300">↵</strong> Select</span>
            <span><strong className="text-slate-300">esc</strong> Close</span>
          </div>
          <span className="text-slate-400">SkillGraph Quick Command Palette</span>
        </div>
      </div>
    </div>
  );
};
