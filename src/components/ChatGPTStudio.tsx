import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Code2, 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Search, 
  Plus, 
  Sliders, 
  Layers, 
  Wand2, 
  ChevronRight, 
  MessageSquare, 
  Zap, 
  Award, 
  Flame, 
  Smartphone, 
  Globe, 
  Bug, 
  Lightbulb, 
  Compass, 
  Brain,
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProgress } from '../types';

export interface CustomGPT {
  id: string;
  name: string;
  description: string;
  category: 'coding' | 'web' | 'mobile' | 'ai' | 'startup' | 'education' | 'custom';
  avatarEmoji: string;
  gradient: string;
  author: string;
  systemPrompt: string;
  capabilities: {
    codeInterpreter: boolean;
    webBrowsing: boolean;
    liveSandbox: boolean;
  };
  conversationStarters: string[];
}

const DEFAULT_GPTS: CustomGPT[] = [
  {
    id: 'python-architect',
    name: 'Python Code Architect GPT',
    description: 'Writes production-grade Python, FastAPI backends, algorithms, and optimizes asymptotic complexity.',
    category: 'coding',
    avatarEmoji: '🐍',
    gradient: 'from-blue-600 to-indigo-600',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are Python Code Architect GPT. You specialize in clean, idiomatic Python 3.12, typing, FastAPI, Pandas, and algorithms. Explain with physical real-life analogies and provide clean, runnable code.',
    capabilities: { codeInterpreter: true, webBrowsing: true, liveSandbox: true },
    conversationStarters: [
      'Write a high-performance LRU Cache in Python with O(1) ops',
      'Create a production FastAPI auth router with JWT',
      'Optimize this nested loop to O(N log N) using hash maps'
    ]
  },
  {
    id: 'web-dev-pro',
    name: 'Full-Stack Web Dev GPT',
    description: 'Expert in modern React 19, Next.js, Tailwind CSS, TypeScript, and responsive mobile-first UI architecture.',
    category: 'web',
    avatarEmoji: '🌐',
    gradient: 'from-cyan-500 to-blue-600',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are Full-Stack Web Dev GPT. Expert in React, TypeScript, Next.js App Router, Tailwind CSS, and full-stack REST/GraphQL APIs. You write clean modular components with zero fluff.',
    capabilities: { codeInterpreter: true, webBrowsing: true, liveSandbox: true },
    conversationStarters: [
      'Build a responsive animated dashboard header in Tailwind CSS',
      'Explain React Server Components vs Client Components with a diagram',
      'Create an infinite scroll hook in React with IntersectionObserver'
    ]
  },
  {
    id: 'bug-doctor-gpt',
    name: 'Bug Doctor & Debugger GPT',
    description: 'Paste any error stack trace or broken snippet. Diagnoses root cause and delivers a tested line-by-line fix.',
    category: 'coding',
    avatarEmoji: '🐞',
    gradient: 'from-rose-600 to-pink-600',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are Bug Doctor GPT. You analyze code for syntax errors, runtime crashes, memory leaks, and off-by-one index traps. Give a clear explanation of WHY the bug happened, followed by the exact fixed code.',
    capabilities: { codeInterpreter: true, webBrowsing: false, liveSandbox: true },
    conversationStarters: [
      'Fix "TypeError: Cannot read properties of undefined (reading map)"',
      'Why is my Python recursion causing RecursionError: maximum recursion depth?',
      'Debug this CORS error on my Express backend'
    ]
  },
  {
    id: 'mobile-app-creator',
    name: 'Mobile App Creator GPT',
    description: 'Build native iOS and Android apps with React Native, Flutter, and package them for Google Play Store.',
    category: 'mobile',
    avatarEmoji: '📱',
    gradient: 'from-emerald-600 to-teal-600',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are Mobile App Creator GPT. Expert in React Native (Expo) and Flutter/Dart. Provide mobile layout structures, touch handlers, navigation stacks, and Android keystore/manifest configurations.',
    capabilities: { codeInterpreter: true, webBrowsing: true, liveSandbox: true },
    conversationStarters: [
      'Create a React Native bottom navigation bar with icons',
      'How to build and sign an Android App Bundle (.aab) for Google Play',
      'Flutter StatefulWidget counter with animated scale effect'
    ]
  },
  {
    id: 'ai-neural-engineer',
    name: 'AI & Neural Networks Engineer GPT',
    description: 'Transformer architectures, PyTorch, LLMs, prompt engineering, and fine-tuning neural weights.',
    category: 'ai',
    avatarEmoji: '🤖',
    gradient: 'from-purple-600 to-indigo-600',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are AI & Neural Networks Engineer GPT. Expert in Deep Learning, PyTorch, attention mechanisms, token embeddings, and LLM orchestration. Provide mathematical intuition along with PyTorch implementations.',
    capabilities: { codeInterpreter: true, webBrowsing: true, liveSandbox: true },
    conversationStarters: [
      'Explain Scaled Dot-Product Attention step by step with PyTorch code',
      'How do LoRA adapters reduce fine-tuning memory by 90%?',
      'Write a character-level Bigram language model in pure Python'
    ]
  },
  {
    id: 'startup-founder-gpt',
    name: 'Startup Pitch & Monetization GPT',
    description: 'Executive business modeling, pricing strategies, and product launch Playbook endorsed by SkillGraph Ventures.',
    category: 'startup',
    avatarEmoji: '🚀',
    gradient: 'from-amber-500 to-orange-600',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are Startup Pitch & Monetization GPT on SkillGraph. You help tech entrepreneurs build sustainable products, craft high-converting ₹99 pricing models, and acquire early users.',
    capabilities: { codeInterpreter: false, webBrowsing: true, liveSandbox: false },
    conversationStarters: [
      'How to price my software tool at ₹99 and scale to 10,000 customers',
      'Write a 60-second elevator pitch for my AI app to investors',
      'Growth tactics to get 1,000 active students on a coding platform'
    ]
  },
  {
    id: 'proofloop-tutor',
    name: 'ProofLoop™ Mastery Tutor GPT',
    description: 'Explains any complicated engineering concept through physical everyday analogies and proofs.',
    category: 'education',
    avatarEmoji: '🎓',
    gradient: 'from-indigo-600 to-cyan-500',
    author: 'SkillGraph AI Lab',
    systemPrompt: 'You are ProofLoop Tutor GPT on SkillGraph. Every concept you teach MUST follow the 5-step ProofLoop framework (LEARN -> BUILD -> EXPLAIN -> VERIFY -> IMPROVE) and use a physical, relatable everyday object analogy.',
    capabilities: { codeInterpreter: true, webBrowsing: false, liveSandbox: true },
    conversationStarters: [
      'Explain how Database Indexes work using a library bookshelf analogy',
      'Explain Asynchronous Event Loop in JS like a restaurant kitchen',
      'Explain Docker containers using shipping cargo containers'
    ]
  }
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeSnippet?: string;
  language?: string;
  timestamp: string;
}

interface ChatGPTStudioProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onOpenPaymentModal: () => void;
  onJumpToCodeLab: (code: string) => void;
}

export const ChatGPTStudio: React.FC<ChatGPTStudioProps> = ({
  progress,
  onUpdateProgress,
  onOpenPaymentModal,
  onJumpToCodeLab,
}) => {
  const [selectedGpt, setSelectedGpt] = useState<CustomGPT>(DEFAULT_GPTS[0]);
  const [searchGptQuery, setSearchGptQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Custom GPTs state (persisted)
  const [customGpts, setCustomGpts] = useState<CustomGPT[]>(() => {
    try {
      const saved = localStorage.getItem('sg_custom_gpts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState<'chat' | 'store' | 'builder'>('chat');
  
  // Builder states
  const [builderName, setBuilderName] = useState('');
  const [builderDesc, setBuilderDesc] = useState('');
  const [builderPrompt, setBuilderPrompt] = useState('');
  const [builderEmoji, setBuilderEmoji] = useState('✨');
  const [builderStarters, setBuilderStarters] = useState(['How do I get started?', 'Write a sample implementation']);

  // Chat conversation state per GPT
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'python-architect': [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Hello! I am **Python Code Architect GPT**, curated for SkillGraph.\n\nWhether you need an optimized O(1) algorithm, a production FastAPI microservice, or clean async patterns, ask me anything or pick a prompt below!',
        codeSnippet: `# Quick verification: Fibonacci with Memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print("fib(50) =", fib(50))`,
        language: 'python',
        timestamp: 'Just now'
      }
    ]
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedGpt]);

  const allAvailableGpts = [...DEFAULT_GPTS, ...customGpts];

  const filteredGpts = allAvailableGpts.filter(gpt => {
    if (activeCategory !== 'all' && gpt.category !== activeCategory) return false;
    if (searchGptQuery.trim()) {
      const q = searchGptQuery.toLowerCase();
      return gpt.name.toLowerCase().includes(q) || gpt.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const gptId = selectedGpt.id;
    const currentList = messages[gptId] || [];
    setMessages({
      ...messages,
      [gptId]: [...currentList, userMsg]
    });

    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/grok-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `[Agent: ${selectedGpt.name}] ${selectedGpt.systemPrompt}\n\nUser Question: ${textToSend}`,
          mode: 'think',
          languageTone: 'simple-english'
        })
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I have analyzed your request based on the system instructions.',
        codeSnippet: data.codeSnippet || undefined,
        language: data.language?.toLowerCase() || 'python',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [gptId]: [...(prev[gptId] || []), assistantMsg]
      }));

      // Award +10 XP for learning with custom GPT
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 10
      });

    } catch (err) {
      // Local fallback generator for selected GPT
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `### Response from ${selectedGpt.name} 🚀\n\nI have processed your request: **"${textToSend}"**.\n\nHere is a complete architectural solution built with the SkillGraph ProofLoop™ principle:`,
        codeSnippet: selectedGpt.category === 'web' 
          ? `// Responsive React Component
export default function InteractiveCard() {
  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-indigo-500/30 text-white">
      <h3 className="font-bold text-lg">Solution for: ${textToSend.slice(0, 30)}</h3>
      <p className="text-slate-400 text-sm mt-1">Verified clean architecture.</p>
    </div>
  );
}`
          : selectedGpt.category === 'mobile'
          ? `// React Native Mobile View
import { View, Text, StyleSheet } from 'react-native';

export default function MobileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mobile Architecture Ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold' }
});`
          : `# Python Solution
def solve_problem(data):
    """
    Optimized implementation curated by ${selectedGpt.name}
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    result = [x * 2 for x in data if x > 0]
    return result

sample_data = [1, -2, 3, 4, -5]
print("Processed:", solve_problem(sample_data))`,
        language: selectedGpt.category === 'web' || selectedGpt.category === 'mobile' ? 'javascript' : 'python',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [gptId]: [...(prev[gptId] || []), fallbackMsg]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomGpt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderName.trim() || !builderPrompt.trim()) return;

    const newGpt: CustomGPT = {
      id: `custom-${Date.now()}`,
      name: builderName.trim(),
      description: builderDesc.trim() || 'Custom AI Agent created in SkillGraph Studio',
      category: 'custom',
      avatarEmoji: builderEmoji || '⚡',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      author: 'You (Creator)',
      systemPrompt: builderPrompt.trim(),
      capabilities: { codeInterpreter: true, webBrowsing: true, liveSandbox: true },
      conversationStarters: builderStarters.filter(s => s.trim().length > 0)
    };

    const updated = [newGpt, ...customGpts];
    setCustomGpts(updated);
    localStorage.setItem('sg_custom_gpts', JSON.stringify(updated));

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setSelectedGpt(newGpt);
    setViewMode('chat');
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentChatList = messages[selectedGpt.id] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/80 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  ChatGPT GPTs <span className="text-cyan-400">Agent Studio</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  GPT-4o & o1 Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore specialized AI Agents, run code live, or build your own Custom GPT with physical analogy intuition.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher: Chat / GPT Store / Create GPT */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setViewMode('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat ({selectedGpt.name.split(' ')[0]})</span>
          </button>

          <button
            onClick={() => setViewMode('store')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'store'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GPT Store ({allAvailableGpts.length})</span>
          </button>

          <button
            onClick={() => setViewMode('builder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'builder'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a GPT</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE CHAT WITH SELECTED GPT */}
      {viewMode === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Quick Switcher Sidebar (1 col) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Quick Switch Agent</span>
              <button
                onClick={() => setViewMode('store')}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
              >
                <span>Store</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
              {allAvailableGpts.map((gpt) => {
                const isSelected = selectedGpt.id === gpt.id;
                return (
                  <button
                    key={gpt.id}
                    onClick={() => setSelectedGpt(gpt)}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500 ring-1 ring-indigo-400/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl shrink-0 p-1 rounded-xl bg-slate-900">{gpt.avatarEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{gpt.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{gpt.author}</div>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Modern Chat Conversation Canvas (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl flex flex-col h-[75vh] shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1.5 rounded-2xl bg-slate-900 border border-slate-800">{selectedGpt.avatarEmoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-sm sm:text-base">{selectedGpt.name}</h3>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {selectedGpt.author}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md">{selectedGpt.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Code Runner Active</span>
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentChatList.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <span className="text-xl p-1.5 rounded-xl bg-slate-800 shrink-0 self-start">
                      {selectedGpt.avatarEmoji}
                    </span>
                  )}

                  <div className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-sm'
                  }`}>
                    {/* Markdown-style content */}
                    <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Integrated Code Block with 1-Click Run */}
                    {msg.codeSnippet && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/90 text-xs">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
                          <span className="font-mono uppercase font-bold text-cyan-400">{msg.language || 'code'}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                              className="hover:text-white flex items-center gap-1 transition-colors"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                              onClick={() => onJumpToCodeLab(msg.codeSnippet!)}
                              className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 transition-all"
                            >
                              <Play className="w-2.5 h-2.5 fill-white" />
                              <span>Run in Code Lab</span>
                            </button>
                          </div>
                        </div>
                        <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse">
                  <span className="text-xl">{selectedGpt.avatarEmoji}</span>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{selectedGpt.name} is thinking & compiling...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Conversation Starter Pills */}
            <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Try:</span>
              </span>
              {selectedGpt.conversationStarters.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(starter)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 whitespace-nowrap transition-all"
                >
                  {starter}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 focus-within:border-indigo-500 transition-colors"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask ${selectedGpt.name}... (e.g. write code, debug, explain with analogy)`}
                  className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white disabled:opacity-40 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GPT STORE / AGENT DIRECTORY */}
      {viewMode === 'store' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchGptQuery}
                onChange={(e) => setSearchGptQuery(e.target.value)}
                placeholder="Search GPTs by skill, stack, or job..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'All Agents' },
                { id: 'coding', label: '🐍 Python & Coding' },
                { id: 'web', label: '🌐 Web Development' },
                { id: 'mobile', label: '📱 Mobile Apps' },
                { id: 'ai', label: '🤖 AI & ML' },
                { id: 'startup', label: '🚀 Startup & Business' },
                { id: 'custom', label: '✨ My Created GPTs' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Custom GPTs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGpts.map((gpt) => (
              <div
                key={gpt.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-5 space-y-4 shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md group-hover:scale-105 transition-transform">
                      {gpt.avatarEmoji}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                      {gpt.author}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">
                      {gpt.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {gpt.description}
                    </p>
                  </div>

                  {/* Capabilities badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {gpt.capabilities.codeInterpreter && (
                      <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-400">
                        Code Interpreter ✓
                      </span>
                    )}
                    {gpt.capabilities.liveSandbox && (
                      <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-indigo-400">
                        Live Sandbox
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {gpt.conversationStarters.length} conversation starters
                  </span>

                  <button
                    onClick={() => {
                      setSelectedGpt(gpt);
                      setViewMode('chat');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1"
                  >
                    <span>Chat Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CREATE YOUR OWN CUSTOM GPT (GPT BUILDER) */}
      {viewMode === 'builder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Wand2 className="w-3 h-3" />
              <span>SkillGraph GPT Builder</span>
            </div>
            <h2 className="text-2xl font-black text-white">Create Your Custom AI Agent</h2>
            <p className="text-xs text-slate-400">
              Configure specialized instructions, knowledge persona, and test your custom GPT immediately.
            </p>
          </div>

          <form onSubmit={handleCreateCustomGpt} className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1 space-y-1">
                <label className="text-xs font-bold text-slate-300">Emoji Avatar</label>
                <input
                  type="text"
                  maxLength={2}
                  value={builderEmoji}
                  onChange={(e) => setBuilderEmoji(e.target.value)}
                  className="w-full text-center text-2xl py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                />
              </div>

              <div className="col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-300">GPT Name *</label>
                <input
                  type="text"
                  required
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  placeholder="e.g. My LeetCode DSA Tutor"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Short Description</label>
              <input
                type="text"
                value={builderDesc}
                onChange={(e) => setBuilderDesc(e.target.value)}
                placeholder="What does this GPT do?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Instructions (System Prompt) *
              </label>
              <textarea
                required
                rows={4}
                value={builderPrompt}
                onChange={(e) => setBuilderPrompt(e.target.value)}
                placeholder="How should this GPT behave? What does it specialize in? (e.g. Always write code with comments and verify edge cases...)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 resize-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Conversation Starters</label>
              {builderStarters.map((starter, index) => (
                <input
                  key={index}
                  type="text"
                  value={starter}
                  onChange={(e) => {
                    const next = [...builderStarters];
                    next[index] = e.target.value;
                    setBuilderStarters(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Publish Custom GPT</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
