import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowRight,
  Code2,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { LanguageTone, UserProgress } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  languageTone: LanguageTone;
  progress: UserProgress;
  onJumpToCodeLab?: (code: string) => void;
  onOpenProofLoop?: () => void;
}

const INITIAL_GREETING: Message = {
  id: 'greet-1',
  role: 'model',
  text: `Hello! Welcome to **SkillGraph** 🚀. I am your personal **Gemini AI Mentor** 🤖.

I specialize in teaching coding (Python & JavaScript) and Artificial Intelligence (Machine Learning, Neural Networks & GenAI) through **real-life everyday analogies** and our 5-stage **ProofLoop™ System** (LEARN ➔ BUILD ➔ EXPLAIN ➔ VERIFY ➔ IMPROVE).

How can I help you today? You can ask me to:
- Explain any coding or AI concept using a real-world metaphor
- Walk you through our new **AI Learning Course**
- Walk you through a ProofLoop learning challenge
- Diagnose an error or bug in your code
- Guide you through packaging SkillGraph for the Google Play Store!`,
  timestamp: 'Just now',
};

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  languageTone,
  progress,
  onJumpToCodeLab,
  onOpenProofLoop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          languageTone,
        }),
      });

      const data = await res.json().catch(() => ({}));
      const replyText = data.reply || (
        !res.ok 
          ? "I am momentarily optimizing my connection. In the meantime, remember SkillGraph's ProofLoop™ principle: break every coding and AI question into physical analogies! Feel free to ask about Python, JavaScript, or Neural Networks."
          : 'Let us explore that with a real-life analogy!'
      );

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `model-fallback-${Date.now()}`,
        role: 'model',
        text: `Welcome to SkillGraph! Here is a core tip: every algorithm can be understood as an everyday physical process. Try asking again in a moment or explore our AI Course tab!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Chat Bubble Launcher */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-extrabold shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-500/80 hover:scale-105 transition-all group"
          title="Chat with Gemini AI Mentor"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse"></span>
          </div>
          <span className="text-xs sm:text-sm tracking-wide">Ask Gemini Mentor</span>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-full max-w-[420px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">Gemini AI Mentor</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ProofLoop
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online · Fast Edge</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([INITIAL_GREETING])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((m) => {
                  const isUser = m.role === 'user';

                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 space-y-1.5 leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-950 border border-slate-800/90 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-line text-[11px] sm:text-xs">
                          {m.text}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/50 text-[9px] text-slate-400">
                          <span>{m.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => copyText(m.id, m.text)}
                              className="text-slate-500 hover:text-slate-300 transition-colors ml-2"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400 inline" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 inline" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-300 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-max">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Gemini is thinking with real-life analogies...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => handleSend('How does the ProofLoop system work?')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[10px] whitespace-nowrap border border-indigo-500/20"
                >
                  🔄 What is ProofLoop?
                </button>
                <button
                  onClick={() => handleSend('Explain Backpropagation with a real-life analogy')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap"
                >
                  🎯 Backprop Metaphor
                </button>
                <button
                  onClick={() => handleSend('Explain Python lists vs tuples in simple terms')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap"
                >
                  🐍 Python Lists vs Tuples
                </button>
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask coding, AI, ProofLoop, or bug question..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
