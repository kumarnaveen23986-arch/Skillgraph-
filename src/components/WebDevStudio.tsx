import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Code2, 
  Play, 
  Sparkles, 
  RotateCw, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layers, 
  ExternalLink,
  Award,
  Zap,
  Terminal,
  Save
} from 'lucide-react';
import { UserProgress } from '../types';

interface WebDevStudioProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onOpenPaymentModal: () => void;
}

export const WebDevStudio: React.FC<WebDevStudioProps> = ({
  progress,
  onUpdateProgress,
  onOpenPaymentModal,
}) => {
  const [prompt, setPrompt] = useState('Build a futuristic AI startup landing page with glassmorphism, pricing cards, and interactive CTA');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);

  // Initial rich project code
  const [projectCode, setProjectCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusAI - Future of Intelligence</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .animate-float { animation: float 3s ease-in-out infinite; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500/30">
  <!-- Nav -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
        <div class="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-black text-cyan-400 text-sm">N</div>
      </div>
      <span class="font-extrabold text-lg text-white">Nexus<span class="text-indigo-400">AI</span></span>
    </div>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="#features" class="text-slate-300 hover:text-white">Features</a>
      <a href="#pricing" class="text-slate-300 hover:text-white">Pricing</a>
      <span class="text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">SkillGraph Studio</span>
    </div>
  </header>

  <!-- Hero -->
  <main class="flex-1 max-w-6xl mx-auto p-6 sm:p-10 space-y-12 w-full">
    <div class="text-center space-y-5 max-w-2xl mx-auto pt-6">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
        <span>⚡ Built with SkillGraph AI Studio</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
        Build Next-Gen Web Apps with <span class="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">AI Precision</span>
      </h1>
      <p class="text-slate-400 text-sm leading-relaxed">
        An interactive single-page application built directly inside SkillGraph like Google AI Studio. Fully customizable in real-time.
      </p>
      <div class="flex items-center justify-center gap-3 pt-2">
        <button id="ctaBtn" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all">
          Deploy Now (Instant)
        </button>
        <span id="counterBadge" class="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          Clicks: 0
        </span>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-indigo-500/50 transition-all shadow-lg hover:-translate-y-1">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">01</div>
        <h3 class="font-bold text-white text-base">Prompt-to-Code</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Describe your layout, features, and styling, and get pristine production code.</p>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-cyan-500/50 transition-all shadow-lg hover:-translate-y-1">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">02</div>
        <h3 class="font-bold text-white text-base">Hot-Reload Sandbox</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Test buttons, forms, and responsive breakpoints instantly in the live browser frame.</p>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-purple-500/50 transition-all shadow-lg hover:-translate-y-1">
        <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">03</div>
        <h3 class="font-bold text-white text-base">Export Anywhere</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Download a single self-contained HTML file ready for GitHub Pages or Vercel.</p>
      </div>
    </div>
  </main>

  <script>
    let clicks = 0;
    const btn = document.getElementById('ctaBtn');
    const badge = document.getElementById('counterBadge');
    btn.addEventListener('click', () => {
      clicks++;
      badge.innerText = 'Clicks: ' + clicks + ' 🚀';
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => btn.style.transform = 'scale(1)', 120);
    });
  </script>
</body>
</html>`);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const updateIframeContent = (htmlContent: string) => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
  };

  useEffect(() => {
    updateIframeContent(projectCode);
  }, [projectCode, activeCodeTab]);

  const handleGenerateWebApp = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-webapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data && data.html) {
        setProjectCode(data.html);
        updateIframeContent(data.html);
      }
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 50,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([projectCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `skillgraph-app-${Date.now()}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(projectCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Web Dev Studio (like aistudio.google)</span>
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>SkillGraph Pro Studio</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Build Complete Web Applications with AI
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm">
                Enter any prompt to generate a production-ready web application with real-time sandbox preview, responsive viewport testing, and live code editing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadHtml}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export HTML</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-600/20"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Prompt Generator Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebApp()}
              placeholder="e.g. Build an e-commerce sneaker shop, crypto tracker, developer portfolio, task board..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <button
              onClick={handleGenerateWebApp}
              disabled={isGenerating}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Web App...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Web App</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Starter Templates */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 whitespace-nowrap">Templates:</span>
            {[
              'Crypto Dashboard with Live Charts',
              'Sneaker E-Commerce Store with Cart',
              'Minimalist Developer Portfolio with Dark Mode',
              'Interactive Quiz App with Scoreboard'
            ].map((tmpl, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(`Build a ${tmpl.toLowerCase()} using Tailwind CSS and interactive JS`);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
              >
                ⚡ {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Dual-Pane Studio Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
          {/* Left Pane: Code Editor (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
            <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Source Code (index.html)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Live Sync</span>
            </div>

            <textarea
              value={projectCode}
              onChange={(e) => {
                setProjectCode(e.target.value);
                updateIframeContent(e.target.value);
              }}
              className="flex-1 p-4 bg-slate-950 text-indigo-300 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              spellCheck={false}
            />
          </div>

          {/* Right Pane: Live Interactive Browser Sandbox (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
            {/* Browser Window Chrome */}
            <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono truncate max-w-xs">
                  https://preview.skillgraph.dev/live-app
                </div>
              </div>

              {/* Viewport Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateIframeContent(projectCode)}
                  className="p-1.5 rounded text-xs text-slate-400 hover:text-white transition-colors"
                  title="Refresh Preview"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Viewport Frame */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto">
              <div
                className={`h-[580px] bg-slate-950 transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-slate-800 ${
                  viewport === 'desktop'
                    ? 'w-full'
                    : viewport === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                <iframe
                  ref={iframeRef}
                  title="Live Web Application Sandbox"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
