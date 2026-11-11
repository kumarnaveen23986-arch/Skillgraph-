import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Sparkles, 
  Play, 
  Trash2, 
  RotateCcw, 
  Check, 
  Copy, 
  Power, 
  Plus, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  FileCode, 
  Palette, 
  Layers, 
  Settings2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { 
  CodeInjection, 
  getSavedInjections, 
  addCodeInjection, 
  toggleCodeInjection, 
  deleteCodeInjection, 
  applySingleInjection,
  applyAllActiveInjections,
  forceCloudSyncToDownloadedApp,
  syncWithServer
} from '../utils/liveCodeApplier';

interface LiveCodeApplierSectionProps {
  onNotify?: (msg: string) => void;
}

export const LiveCodeApplierSection: React.FC<LiveCodeApplierSectionProps> = ({ onNotify }) => {
  const [injections, setInjections] = useState<CodeInjection[]>(getSavedInjections());
  const [codeType, setCodeType] = useState<'css' | 'javascript' | 'html' | 'config'>('css');
  const [title, setTitle] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Gemini 3.8 Flash Assistant state
  const [geminiDirective, setGeminiDirective] = useState('');
  const [isGeneratingWithGemini, setIsGeneratingWithGemini] = useState(false);
  const [geminiResultCode, setGeminiResultCode] = useState<string | null>(null);

  // Live preview tab for HTML/CSS
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Cloud Sync state for installed/downloaded mobile app
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>('Live Connected');

  useEffect(() => {
    const handleSync = () => {
      setInjections(getSavedInjections());
    };
    const handleCloudStatus = (e: any) => {
      if (e?.detail?.timestamp) {
        setLastCloudSyncTime(new Date(e.detail.timestamp).toLocaleTimeString());
      }
    };
    window.addEventListener('sg-injections-updated', handleSync);
    window.addEventListener('sg-cloud-sync-status', handleCloudStatus);
    return () => {
      window.removeEventListener('sg-injections-updated', handleSync);
      window.removeEventListener('sg-cloud-sync-status', handleCloudStatus);
    };
  }, []);

  const handleForceCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await forceCloudSyncToDownloadedApp();
      setStatusMessage({ text: res.message, isError: !res.success });
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      if (onNotify) onNotify(res.message);
    } catch (err: any) {
      setStatusMessage({ text: 'Sync error: ' + err?.message, isError: true });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Preset code templates
  const PRESET_TEMPLATES = [
    {
      id: 'css-cyber-neon',
      name: '🎨 Neon Cyber Glow Cards (CSS)',
      type: 'css' as const,
      title: 'Neon Cyber Glow Card Styles',
      desc: 'Adds vibrant glowing borders and futuristic shadows to cards.',
      code: `/* Custom Neon Cyber Glow Stylesheet */
.bg-slate-900 {
  border-color: rgba(99, 102, 241, 0.4) !important;
  box-shadow: 0 4px 20px -2px rgba(99, 102, 241, 0.15) !important;
  transition: all 0.3s ease !important;
}

.bg-slate-900:hover {
  border-color: rgba(6, 182, 212, 0.7) !important;
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.25) !important;
}`
    },
    {
      id: 'html-floating-banner',
      name: '📢 Custom Top Alert Widget (HTML)',
      type: 'html' as const,
      title: 'Custom Announcement Banner',
      desc: 'Renders an interactive animated alert bar across the app.',
      code: `<div class="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-cyan-950 to-slate-950 border border-cyan-400/40 text-xs flex items-center justify-between gap-3 shadow-2xl">
  <div class="flex items-center gap-2">
    <span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">NEW</span>
    <span class="font-bold text-white">Gemini 3.8 Flash Code Injection Active!</span>
    <span class="text-slate-300 hidden md:inline">Your custom components and styles are applied live.</span>
  </div>
  <button onclick="this.parentElement.remove()" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold">Dismiss</button>
</div>`
    },
    {
      id: 'js-xp-toast',
      name: '⚡ Celebration & Notification Trigger (JS)',
      type: 'javascript' as const,
      title: 'Celebration Toast Script',
      desc: 'Demonstrates JavaScript hook execution with SkillGraph runtime.',
      code: `// SkillGraph Live JavaScript Hook
console.log("Custom script executed successfully at " + new Date().toLocaleTimeString());
if (window.SkillGraphCustom) {
  window.SkillGraphCustom.showNotification("✨ Custom JavaScript injection applied and running live!");
  window.SkillGraphCustom.addBonusXp(50);
}`
    },
    {
      id: 'config-course-feature',
      name: '⚙️ Dynamic Feature Config (JSON)',
      type: 'config' as const,
      title: 'Custom Feature Flag Config',
      desc: 'Dynamically updates feature configuration flags.',
      code: `{
  "customFeature": "Full-Stack Creator Mode",
  "version": "2.4.0",
  "enabled": true,
  "theme": "dark_cyberpunk",
  "maxTokens": 4096,
  "creatorBadges": ["Verified Creator", "Top Student"]
}`
    }
  ];

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeContent.trim()) {
      setStatusMessage({ text: 'Please enter or paste code content first.', isError: true });
      return;
    }

    const patchTitle = title.trim() || `Custom ${codeType.toUpperCase()} Patch (${new Date().toLocaleTimeString()})`;
    const result = addCodeInjection({
      title: patchTitle,
      type: codeType,
      code: codeContent.trim(),
      description: description.trim() || `Injected via Advanced Settings live code applier`,
      enabled: true,
      targetLocation: 'global',
    });

    if (result.success) {
      setStatusMessage({ text: `✓ Successfully applied "${patchTitle}" to SkillGraph live!`, isError: false });
      if (onNotify) onNotify(`Applied "${patchTitle}" live!`);
      // Clear inputs
      setTitle('');
      setCodeContent('');
      setDescription('');
    } else {
      setStatusMessage({ text: `Execution Notice: ${result.log}`, isError: true });
    }
  };

  const handleToggle = (id: string, currentEnabled: boolean) => {
    const res = toggleCodeInjection(id, !currentEnabled);
    setStatusMessage({
      text: res.log,
      isError: !res.success,
    });
  };

  const handleDelete = (id: string, itemTitle: string) => {
    deleteCodeInjection(id);
    setStatusMessage({ text: `Removed "${itemTitle}" from active injections.`, isError: false });
  };

  const handleSelectTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setCodeType(tpl.type);
    setTitle(tpl.title);
    setDescription(tpl.desc);
    setCodeContent(tpl.code);
    setStatusMessage({ text: `Loaded template: "${tpl.name}". Click "Apply Code to App Now" to activate it.`, isError: false });
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCodeContent(text);
        // Auto-detect code type
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
          setCodeType('config');
        } else if (text.includes('<div') || text.includes('<span') || text.includes('<style>') || text.includes('</')) {
          setCodeType('html');
        } else if (text.includes('{') && (text.includes(':') || text.includes('@media') || text.includes('.'))) {
          setCodeType('css');
        } else if (text.includes('function') || text.includes('const') || text.includes('console.log') || text.includes('=>')) {
          setCodeType('javascript');
        }
        setStatusMessage({ text: 'Pasted code from clipboard successfully!', isError: false });
      }
    } catch (e) {
      setStatusMessage({ text: 'Unable to access clipboard. Please paste directly into the code box.', isError: true });
    }
  };

  // Generate code via Gemini 3.8 Flash
  const handleGenerateWithGemini = async () => {
    if (!geminiDirective.trim()) {
      setStatusMessage({ text: 'Please enter what you want Gemini 3.8 Flash to write code for.', isError: true });
      return;
    }

    setIsGeneratingWithGemini(true);
    setStatusMessage(null);
    setGeminiResultCode(null);

    try {
      const res = await fetch('/api/ceo-gemini-modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directive: geminiDirective.trim(),
          category: codeType === 'css' ? 'feature' : codeType === 'html' ? 'feature' : 'system',
          actionType: 'architect_and_implement',
        }),
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();

      const generatedCode = data.codeSnippet || data.architecturalSummary || '// Generated code';
      setGeminiResultCode(generatedCode);
      setCodeContent(generatedCode);
      if (!title) {
        setTitle(data.featureTitle || geminiDirective.slice(0, 40));
      }
      setStatusMessage({
        text: `✓ Gemini 3.8 Flash generated code successfully! Review below and click "Apply Code to App Now".`,
        isError: false,
      });
    } catch (err: any) {
      console.error('Gemini code generation error:', err);
      setStatusMessage({ text: `Gemini Engine Notice: ${err?.message || 'Using fallback'}.`, isError: true });
    } finally {
      setIsGeneratingWithGemini(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/40 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
                <Code className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Live Code Injector & Dynamic Customizer
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                  Gemini 3.8 Flash Code Applier
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Gemini 3.8 Flash se mila hua code yahan daal kar app me changes aur new features directly add aur test karein.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              applyAllActiveInjections();
              setStatusMessage({ text: 'Re-evaluated and applied all active code injections.', isError: false });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700 cursor-pointer shadow-sm"
            title="Re-run all active injections"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reload All Injections</span>
          </button>
        </div>

        {/* Quick Summary Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Custom CSS</span>
              <span className="text-xs font-bold text-slate-200">Instant Styling</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">JavaScript</span>
              <span className="text-xs font-bold text-slate-200">Interactive Logic</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">HTML Widgets</span>
              <span className="text-xs font-bold text-slate-200">Banners & Embeds</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">JSON Config</span>
              <span className="text-xs font-bold text-slate-200">Feature Flags</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Real-Time Cloud Synchronization to Downloaded Mobile App */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-white">
                📱 Downloaded App Live Cloud Sync (डाउनलोड ऐप सिंक)
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active & Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Yahan jo bhi code, styling ya widgets add karenge, wo <span className="text-emerald-300 font-semibold">aapke phone me downloaded / installed SkillGraph app me automatically sync</span> ho jayenge. Dobara app download karne ki zarurat nahi hai!
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Status: Synchronized with Edge Server</span> • <span>Last Synced: {lastCloudSyncTime}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleForceCloudSync}
          disabled={isSyncingCloud}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
          <span>{isSyncingCloud ? 'Syncing with Phone...' : '🔄 Force Sync to Downloaded App'}</span>
        </button>
      </div>

      {/* Status Notice Toast */}
      {statusMessage && (
        <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 shadow-lg animate-fadeIn ${
          statusMessage.isError 
            ? 'bg-red-950/60 border-red-500/40 text-red-200' 
            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            {statusMessage.isError ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{statusMessage.text}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Step 1: Integrated Gemini 3.8 Flash Code Generator Assistant */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Step 1: Ask Gemini 3.8 Flash to Write Code for Your App Change
            </h3>
          </div>
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold">
            Permanent Gemini 3.8 Flash
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Aap Gemini 3.8 Flash ko batayein ki aapko SkillGraph app me kya badalna ya add karna hai. Gemini uska ready code generate karega:
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={geminiDirective}
            onChange={(e) => setGeminiDirective(e.target.value)}
            placeholder="e.g. Add a glowing purple gradient border to cards, or create a study reminder widget..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateWithGemini()}
          />
          <button
            type="button"
            onClick={handleGenerateWithGemini}
            disabled={isGeneratingWithGemini || !geminiDirective.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            {isGeneratingWithGemini ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Code</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-500 font-semibold">Quick Prompts:</span>
          {[
            'Neon Cyan Glowing Course Cards',
            'Top Notification Banner for Today Special Lesson',
            'Confetti Sound Celebration Hook on Exercise Complete',
            'High-Contrast Ultra Dark Theme Styles'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setGeminiDirective(prompt)}
              className="text-[10px] text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 px-2 py-0.5 rounded-lg transition-all"
            >
              + {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Templates Quick Load */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ready-to-Use Code Templates:</span>
          </span>
          <span className="text-[11px] text-slate-500">Click any preset to load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {tpl.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {tpl.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{tpl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Code Editor Form (Paste Code Here and Apply) */}
      <form onSubmit={handleApplyCode} className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Step 2: Paste Code & Choose Target Type</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste the CSS, JS, HTML or Config code and click Apply. Changes take effect instantly!
            </p>
          </div>

          {/* Code Type Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'css', label: 'CSS (Styles)' },
              { id: 'javascript', label: 'JavaScript' },
              { id: 'html', label: 'HTML (Widget)' },
              { id: 'config', label: 'JSON Config' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCodeType(t.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  codeType === t.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patch Name & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Feature / Patch Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Glowing Neon Blue Buttons"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Description / Notes (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Changes button border radius and adds glow"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Code Input Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>Code Payload ({codeType.toUpperCase()}):</span>
              <span className="text-[10px] text-cyan-400 font-mono">Live Injected</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 px-2 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Paste from Clipboard</span>
              </button>

              <button
                type="button"
                onClick={() => setCodeContent('')}
                className="text-[11px] font-bold text-slate-400 hover:text-red-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
            <textarea
              rows={9}
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder={
                codeType === 'css'
                  ? `/* Paste custom CSS here */\n.bg-slate-900 {\n  border: 1px solid #06b6d4 !important;\n}`
                  : codeType === 'javascript'
                  ? `// Paste custom JavaScript here\nconsole.log("Custom script running live!");\nwindow.SkillGraphCustom?.showNotification("Hello from custom script!");`
                  : codeType === 'html'
                  ? `<!-- Paste custom HTML widget / banner here -->\n<div class="p-3 bg-indigo-900/80 rounded-xl text-white text-xs font-bold">\n  🔥 Welcome to SkillGraph Custom Banner!\n</div>`
                  : `{\n  "feature": "Custom JSON",\n  "enabled": true\n}`
              }
              className="w-full p-3.5 bg-slate-950 text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] text-slate-400">
              Changes apply instantly into DOM & survive page reload
            </span>
          </div>

          <div className="flex items-center gap-2">
            {codeType === 'html' && (
              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer flex items-center gap-1.5"
              >
                {showLivePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{showLivePreview ? 'Hide Preview' : 'Live Preview'}</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!codeContent.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>⚡ Apply Code to App Now</span>
            </button>
          </div>
        </div>

        {/* Live Preview Container if enabled */}
        {showLivePreview && codeContent && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2 animate-fadeIn">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              Live Widget Preview Sandbox:
            </span>
            <div 
              className="p-3 rounded-xl bg-slate-900 border border-slate-800"
              dangerouslySetInnerHTML={{ __html: codeContent }}
            />
          </div>
        )}
      </form>

      {/* Step 3: Manage Saved & Active Injections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Active Code Injections & History ({injections.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Toggle ON/OFF or delete anytime</span>
        </div>

        {injections.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
            <Code className="w-6 h-6 text-slate-600 mx-auto" />
            <p>No custom code injected yet.</p>
            <p className="text-[11px] text-slate-500">
              Paste code in the box above or pick a template to apply changes live!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {injections.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 shadow-md ${
                  item.enabled
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-cyan-500/5'
                    : 'bg-slate-950/80 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      item.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                    }`} />
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-bold border border-slate-700 shrink-0">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id, item.enabled)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        item.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{item.enabled ? 'ACTIVE' : 'OFF'}</span>
                    </button>

                    {/* Re-run */}
                    <button
                      type="button"
                      onClick={() => {
                        const res = applySingleInjection(item);
                        setStatusMessage({ text: res.log, isError: !res.success });
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
                      title="Re-run injection"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Copy Code */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(item.code);
                        setCopiedId(item.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
                      title="Copy code snippet"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/40 cursor-pointer"
                      title="Delete injection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-4">
                    {item.description}
                  </p>
                )}

                {/* Code Preview snippet */}
                <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-24">
                  <pre className="whitespace-pre-wrap">{item.code}</pre>
                </div>

                {item.executionLog && (
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                    <span>Status: {item.executionLog}</span>
                    <span>Applied: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
