import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  Brain, 
  Film, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Wand2, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Tag, 
  Download,
  AlertCircle
} from 'lucide-react';
import { UserProgress } from '../types';

interface HiiAIToolsHubProps {
  progress: UserProgress;
  onLaunchEmbeddedStudio: (studioId: string) => void;
  onOpenUpgradeModal: () => void;
}

interface TrendingEffectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  previewColor: string;
  isPremium: boolean;
  tags: string[];
}

export const HiiAIToolsHub: React.FC<HiiAIToolsHubProps> = ({
  progress,
  onLaunchEmbeddedStudio,
  onOpenUpgradeModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [effectsList, setEffectsList] = useState<TrendingEffectItem[]>([]);
  const [isLoadingEffects, setIsLoadingEffects] = useState(false);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  // Quick external official homepages
  const AI_PROVIDERS = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      tagline: 'Multimodal AI with 1M+ token context window',
      officialUrl: 'https://gemini.google.com',
      embeddedTab: 'ask',
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-cyan-300',
      badge: 'Gemini 3.8 Flash',
    },
    {
      id: 'gpt',
      name: 'OpenAI ChatGPT',
      tagline: 'Advanced GPT-4o reasoning and coding assistant',
      officialUrl: 'https://chatgpt.com',
      embeddedTab: 'chatgpt',
      icon: MessageSquare,
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-300',
      badge: 'GPTs Studio',
    },
    {
      id: 'grok',
      name: 'xAI Grok',
      tagline: 'Real-time first-principles Think Mode reasoning',
      officialUrl: 'https://grok.com',
      embeddedTab: 'grok',
      icon: Brain,
      color: 'from-slate-700 to-zinc-900',
      textColor: 'text-slate-200',
      badge: 'Think Mode',
    },
    {
      id: 'flow',
      name: 'Flow AI Video',
      tagline: 'Cinematic prompt-to-video creative simulator',
      officialUrl: 'https://flow.google',
      embeddedTab: 'flowai',
      icon: Film,
      color: 'from-pink-600 to-purple-700',
      textColor: 'text-pink-300',
      badge: '10s Video Clip',
    },
  ];

  // Fetch trending effects from server
  useEffect(() => {
    setIsLoadingEffects(true);
    fetch('/api/effects')
      .then((res) => res.json())
      .then((data) => {
        if (data.effects) {
          setEffectsList(data.effects);
        }
      })
      .catch(() => {
        // Fallback default effects if offline
        setEffectsList([
          {
            id: 'eff-1',
            title: 'Cyberpunk Hyperlapse Glow',
            category: 'vfx',
            description: 'Neon edge detection with volumetric chromatic dispersion for fast-paced viral mobile reels.',
            previewColor: 'from-pink-500 to-purple-600',
            isPremium: false,
            tags: ['CapCut', 'Premiere', 'Reels', 'Mobile'],
          },
          {
            id: 'eff-2',
            title: 'Smooth Velocity Zoom Blur',
            category: 'transition',
            description: 'Dynamic ease-in speed ramping transition with directional motion blur sync.',
            previewColor: 'from-cyan-500 to-blue-600',
            isPremium: true,
            tags: ['Velocity', 'Transitions', 'Music Sync'],
          },
          {
            id: 'eff-3',
            title: 'Flow AI Cinematic Depth Map',
            category: 'ai-workflow',
            description: 'AI 2.5D parallax separation using MiDaS neural depth estimation workflow.',
            previewColor: 'from-amber-500 to-orange-600',
            isPremium: true,
            tags: ['AI Video', 'Depth', 'Parallax', '3D'],
          },
        ]);
      })
      .finally(() => setIsLoadingEffects(false));
  }, []);

  const filteredEffects = selectedCategory === 'all'
    ? effectsList
    : effectsList.filter((e) => e.category === selectedCategory);

  const isPremium = (progress as any).isPremium;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 animate-fadeIn">
      {/* Toast Notification */}
      {appliedToast && (
        <div className="fixed top-20 right-4 z-50 p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Super Gateway</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">HII Enterprise Engine</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          AI Tools & Creator Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Access leading models including Gemini, GPT, Grok, and Flow AI. Launch embedded authorized tools or jump directly to official provider sites.
        </p>

        {/* Notice on official subscriptions */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Note: Opening official provider websites requires your own account on their respective platforms. Embedded studios run through HII's authorized secure backend gateway.
          </span>
        </div>
      </div>

      {/* 1. Four Core AI Providers (Gemini, GPT, Grok, Flow) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 px-1">Major AI Models & Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_PROVIDERS.map((provider) => {
            const Icon = provider.icon;
            return (
              <div
                key={provider.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${provider.color} p-0.5 shadow-md flex items-center justify-center text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{provider.name}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-950 border border-slate-800 font-bold ${provider.textColor}`}>
                          {provider.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{provider.tagline}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onLaunchEmbeddedStudio(provider.embeddedTab)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={provider.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1 shrink-0"
                    title={`Visit official ${provider.name} website`}
                  >
                    <span>Official Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. HII Embedded Creator Studios */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 px-1">Embedded Creator & Learning Studios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* HII AI Teacher */}
          <div
            onClick={() => onLaunchEmbeddedStudio('ask')}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500/50 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                HII AI Teacher
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                Socratic mentor using real-life physical analogies to explain any complex concept.
              </p>
            </div>
          </div>

          {/* AI Video Studio */}
          <div
            onClick={() => onLaunchEmbeddedStudio('flowai')}
            className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/30 via-slate-900 to-slate-900 border border-pink-500/30 hover:border-pink-500/50 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                AI Video Studio
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                Generate 10-second cinematic simulations from text descriptions.
              </p>
            </div>
          </div>

          {/* AI Web Dev Studio */}
          <div
            onClick={() => onLaunchEmbeddedStudio('webstudio')}
            className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-900 border border-cyan-500/30 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 shadow-md group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                AI Web Dev Studio
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                Prompt to live HTML/Tailwind web app simulation in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trending Effects Library (Admin-Managed Catalog) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <span>Trending Effects & Video Workflows</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Live server-managed catalog of transitions, VFX, and mobile creator presets.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'vfx', 'transition', 'color', 'ai-workflow', 'preset'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Effects Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredEffects.map((effect) => (
            <div
              key={effect.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-bold">
                    {effect.category}
                  </span>
                  {effect.isPremium && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>PRO</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-white leading-snug">{effect.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{effect.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {effect.tags.map((tag) => (
                    <span key={tag} className="text-[9px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (effect.isPremium && !isPremium) {
                      onOpenUpgradeModal();
                      return;
                    }
                    setAppliedToast(`Applied "${effect.title}" preset to workspace!`);
                    setTimeout(() => setAppliedToast(null), 3000);
                  }}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    effect.isPremium && !isPremium
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{effect.isPremium && !isPremium ? 'Unlock with Pro (₹99)' : 'Use Preset'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
