import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Terminal, 
  Send, 
  Zap, 
  RotateCw, 
  Flame, 
  Brain, 
  Code2, 
  Check, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Search,
  Award
} from 'lucide-react';
import { UserProgress } from '../types';

interface GrokAIStudioProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onJumpToCodeLab: (code: string) => void;
  onOpenPaymentModal: () => void;
}

type GrokMode = 'think' | 'unhinged' | 'deepsearch';

interface GrokMessage {
  id: string;
  sender: 'user' | 'grok';
  text: string;
  thinkingSteps?: string[];
  thinkingDuration?: number;
  codeSnippet?: string;
  language?: string;
  keyTakeaway?: string;
}

export const GrokAIStudio: React.FC<GrokAIStudioProps> = ({
  progress,
  onUpdateProgress,
  onJumpToCodeLab,
  onOpenPaymentModal,
}) => {
  const [mode, setMode] = useState<GrokMode>('think');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<GrokMessage[]>([
    {
      id: 'welcome',
      sender: 'grok',
      text: "I am Grok AI integrated into SkillGraph. I don't give fluffy corporate non-answers. In **Think Mode**, I reveal my reasoning tokens. In **Unhinged Mode**, I give you the unfiltered truth about software engineering.",
      thinkingSteps: [
        'Bootstrapping Grok reasoning engine...',
        'Linking to SkillGraph ProofLoop verification matrix...',
        'Ready for unfiltered, first-principles logic.'
      ],
      thinkingDuration: 0.8,
      keyTakeaway: 'First-principles logic beats syntax memorization every time.'
    }
  ]);

  const toggleThoughts = (id: string) => {
    setExpandedThoughts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: GrokMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/grok-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          mode,
        }),
      });

      const data = await response.json();
      const grokMsgId = `grok-${Date.now()}`;
      const grokMsg: GrokMessage = {
        id: grokMsgId,
        sender: 'grok',
        text: data.answer || "Grok synthesized response based on first principles.",
        thinkingSteps: data.thinkingSteps,
        thinkingDuration: data.thinkingDurationSeconds,
        codeSnippet: data.codeSnippet,
        language: data.language,
        keyTakeaway: data.keyTakeaway,
      };

      setMessages(prev => [...prev, grokMsg]);
      // Auto expand thoughts for think mode
      if (data.thinkingSteps && data.thinkingSteps.length > 0) {
        setExpandedThoughts(prev => ({ ...prev, [grokMsgId]: true }));
      }

      onUpdateProgress({
        ...progress,
        xp: progress.xp + 25,
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `grok-err-${Date.now()}`,
          sender: 'grok',
          text: "Grok is operating at maximum throughput. Focus on understanding the physical state of your memory and loop variables via ProofLoop!",
          keyTakeaway: "Computers are deterministic state machines."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Grok AI Engine</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Grok 3 Reasoning
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  xAI Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Truth-seeking AI with internal reasoning tokens & unhinged mode
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode('think')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'think'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Think Mode</span>
            </button>

            <button
              onClick={() => setMode('unhinged')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'unhinged'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Unhinged</span>
            </button>

            <button
              onClick={() => setMode('deepsearch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'deepsearch'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>DeepSearch</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="space-y-4 min-h-[400px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg'
                }`}
              >
                {/* Thinking Collapsible (Grok style) */}
                {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                  <div className="border border-slate-800 bg-slate-950/70 rounded-xl overflow-hidden text-xs">
                    <button
                      onClick={() => toggleThoughts(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-slate-400 hover:text-cyan-300 font-mono text-[11px] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Thought process ({msg.thinkingDuration || 1.2}s)</span>
                      </span>
                      {expandedThoughts[msg.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {expandedThoughts[msg.id] && (
                      <div className="px-3 pb-3 pt-1 space-y-1 font-mono text-[11px] text-slate-400 border-t border-slate-850">
                        {msg.thinkingSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                            <span className="text-cyan-400">↳</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Text */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Runnable Code Snippet */}
                {msg.codeSnippet && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{msg.language || 'Code'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.codeSnippet!, msg.id)}
                          className="hover:text-white flex items-center gap-1"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => onJumpToCodeLab(msg.codeSnippet!)}
                          className="hover:text-emerald-400 flex items-center gap-1 font-bold text-emerald-400"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>Run in Code Lab</span>
                        </button>
                      </div>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 overflow-x-auto border border-slate-800">
                      <code>{msg.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Key Takeaway */}
                {msg.keyTakeaway && (
                  <div className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{msg.keyTakeaway}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-400 flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Grok is reasoning through first principles...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 z-20 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-md flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              mode === 'think' 
                ? "Ask a deep question to see Grok's step-by-step thinking tokens..." 
                : mode === 'unhinged' 
                ? "Ask Grok anything for an unfiltered, witty, brutally honest truth..."
                : "Enter any engineering problem for deep structural breakdown..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
