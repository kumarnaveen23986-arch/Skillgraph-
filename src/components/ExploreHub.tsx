import React from 'react';
import { 
  Film, 
  Brain, 
  Bot, 
  Scissors, 
  Stethoscope, 
  Globe, 
  Compass, 
  RotateCw, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Flame, 
  ShieldCheck,
  Video,
  Code2,
  FolderGit2
} from 'lucide-react';
import { UserProgress } from '../types';

interface ExploreHubProps {
  progress: UserProgress;
  onSelectFeature: (featureId: string) => void;
  onOpenPaymentModal: () => void;
}

export const ExploreHub: React.FC<ExploreHubProps> = ({
  progress,
  onSelectFeature,
  onOpenPaymentModal,
}) => {
  const isPro = Boolean(progress.isPremium);

  const FEATURE_CARDS = [
    {
      id: 'codelab',
      title: 'Interactive Code Lab & IDE',
      badge: 'Live Compiler',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Run Python, JavaScript, and Web code with instant execution, physical analogy intuition, and live sandbox terminal.',
      icon: Code2,
      iconBg: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
      gradientBorder: 'hover:border-emerald-500/50',
      accentColor: 'from-emerald-500 to-teal-500',
      isVip: false,
      tag: 'Code Lab',
    },
    {
      id: 'flowai',
      title: 'Flow AI Video Studio',
      badge: 'Gen-3 Video',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Text-to-Video & Image-to-Video synthesis with dynamic 3D camera controls and 60fps fluid simulation.',
      icon: Film,
      iconBg: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
      gradientBorder: 'hover:border-purple-500/50',
      accentColor: 'from-purple-600 to-pink-600',
      isVip: false,
      tag: 'AI Video',
    },
    {
      id: 'grok',
      title: 'Grok AI Studio',
      badge: 'Thinking Engine',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      description: 'Explore step-by-step thinking tokens, unhinged first-principles reasoning, and deep search analysis.',
      icon: Brain,
      iconBg: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20',
      gradientBorder: 'hover:border-cyan-500/50',
      accentColor: 'from-cyan-500 to-indigo-600',
      isVip: false,
      tag: 'Reasoning',
    },
    {
      id: 'chatgpt',
      title: 'ChatGPT & Custom GPTs',
      badge: 'GPTs Hub',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Access curated specialized AI assistants (Python Architect, Startup Pitch, DSA Master) or build your own.',
      icon: Bot,
      iconBg: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
      gradientBorder: 'hover:border-emerald-500/50',
      accentColor: 'from-emerald-600 to-teal-600',
      isVip: false,
      tag: 'Custom GPTs',
    },
    {
      id: 'video-editing',
      title: 'Video Editing & Trending VFX',
      badge: 'VIP Tutorial',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'CapCut masterclass, Premiere Pro workflows, AI visual effects, and viral reels editing techniques.',
      icon: Scissors,
      iconBg: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
      gradientBorder: 'hover:border-amber-500/50',
      accentColor: 'from-amber-500 to-orange-500',
      isVip: true,
      tag: 'Editing & VFX',
    },
    {
      id: 'bugdoctor',
      title: '24/7 AI Code Doctor',
      badge: 'Always Online',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Permanent bug diagnostic doctor. Paste any broken code or error to receive root cause analogies and instant fixes.',
      icon: Stethoscope,
      iconBg: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20',
      gradientBorder: 'hover:border-rose-500/50',
      accentColor: 'from-rose-600 to-pink-600',
      isVip: false,
      tag: 'Debugger',
    },
    {
      id: 'webstudio',
      title: 'Web Dev Studio',
      badge: 'App Builder',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Generate full interactive single-page web applications with live preview, editable code, and instant deployment.',
      icon: Globe,
      iconBg: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
      gradientBorder: 'hover:border-blue-500/50',
      accentColor: 'from-blue-600 to-cyan-500',
      isVip: false,
      tag: 'Web Apps',
    },
    {
      id: 'proofloop',
      title: 'ProofLoop™ Verification',
      badge: 'Core Framework',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: '5-Stage proof system: LEARN ➔ BUILD ➔ EXPLAIN ➔ VERIFY ➔ IMPROVE. Earn verified digital credentials.',
      icon: RotateCw,
      iconBg: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20',
      gradientBorder: 'hover:border-indigo-500/50',
      accentColor: 'from-indigo-600 to-cyan-600',
      isVip: false,
      tag: 'Verification',
    },
    {
      id: 'aicourse',
      title: 'AI & Neural Sandbox',
      badge: 'Interactive Labs',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      description: 'Train visual perceptrons, watch gradient descent adjust weights in real-time, and build neural architectures.',
      icon: Cpu,
      iconBg: 'bg-fuchsia-500/10 text-fuchsia-400 group-hover:bg-fuchsia-500/20',
      gradientBorder: 'hover:border-fuchsia-500/50',
      accentColor: 'from-fuchsia-600 to-purple-600',
      isVip: false,
      tag: 'Neural Nets',
    },
    {
      id: 'maps',
      title: 'Google Maps Platform Lab',
      badge: 'Geospatial',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Interactive map styles, route optimization, nearby search, and geocoding playground.',
      icon: Compass,
      iconBg: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
      gradientBorder: 'hover:border-emerald-500/50',
      accentColor: 'from-emerald-500 to-teal-500',
      isVip: false,
      tag: 'Maps API',
    },
    {
      id: 'workspace',
      title: 'Google Drive & Gmail Studio',
      badge: '1P Integration',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Connect official Google Drive to browse & save code notes, and compose or read study reports in Gmail.',
      icon: FolderGit2,
      iconBg: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
      gradientBorder: 'hover:border-blue-500/50',
      accentColor: 'from-blue-600 to-indigo-600',
      isVip: false,
      tag: 'Workspace',
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>All-In-One AI & Tools Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Explore AI Studios &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Creator Labs
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            All advanced creation suites in one unified hub—from Flow AI video generation and Grok thinking reasoning to custom GPTs, 24/7 AI bug doctor, and video editing masterclasses.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>9 Integrated AI Creation Engines</span>
            </span>

            {!isPro && (
              <button
                onClick={onOpenPaymentModal}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-md transition-all flex items-center gap-1"
              >
                <span>Unlock All Pro Tools (₹99 / ₹299)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Tools & Studios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURE_CARDS.map((tool) => {
          const Icon = tool.icon;
          const isLocked = tool.isVip && !isPro;

          return (
            <div
              key={tool.id}
              onClick={() => {
                if (isLocked) {
                  onOpenPaymentModal();
                } else {
                  onSelectFeature(tool.id);
                }
              }}
              className={`group relative rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-lg hover:shadow-2xl hover:bg-slate-900 ${tool.gradientBorder}`}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${tool.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    {isLocked && (
                      <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Tag */}
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {tool.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  {isLocked ? 'Requires Pro / VIP Pass' : 'Ready to Launch'}
                </span>

                <div className={`flex items-center gap-1 font-bold transition-transform group-hover:translate-x-1 ${isLocked ? 'text-amber-400' : 'text-indigo-400'}`}>
                  <span>{isLocked ? 'Unlock Access' : 'Open Studio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
