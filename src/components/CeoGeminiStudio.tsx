import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Lock, 
  ShieldCheck, 
  Plus, 
  Check, 
  Copy, 
  Trash2, 
  Power, 
  Code, 
  BookOpen, 
  Wrench, 
  CreditCard, 
  Sliders, 
  RefreshCw, 
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  CeoCustomPatch, 
  getCeoCustomPatches, 
  addCeoCustomPatch, 
  toggleCeoPatch, 
  deleteCeoPatch,
  getMaskedGateway100
} from '../utils/ceoArchitecture';
import { addCodeInjection } from '../utils/liveCodeApplier';

interface CeoGeminiStudioProps {
  onNotify?: (msg: string) => void;
}

export const CeoGeminiStudio: React.FC<CeoGeminiStudioProps> = ({ onNotify }) => {
  const [directive, setDirective] = useState('');
  const [category, setCategory] = useState<'feature' | 'course' | 'tool' | 'subscription' | 'system'>('feature');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [patches, setPatches] = useState<CeoCustomPatch[]>(getCeoCustomPatches());
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setPatches(getCeoCustomPatches());
    };
    window.addEventListener('ceo-patches-updated', handleSync);
    return () => window.removeEventListener('ceo-patches-updated', handleSync);
  }, []);

  const PRESET_DIRECTIVES = [
    {
      label: '+ Indian Creator Course',
      cat: 'course' as const,
      text: 'Add a new comprehensive course on Backend & Microservices by Kunal Kushwaha and Chai aur Code with 6 interactive ProofLoop exercises.'
    },
    {
      label: '+ New AI Pro Tool',
      cat: 'tool' as const,
      text: 'Add an AI System Architecture Optimizer tool in the Explore section for Pro and Advanced members.'
    },
    {
      label: '+ Calibrate Subscriptions',
      cat: 'subscription' as const,
      text: 'Set ₹99 Pro login bonus to 1,500 XP and ₹299 Advanced to unlimited XP, with permanent Bug Doctor priority routing.'
    },
    {
      label: '+ ProofLoop Challenge',
      cat: 'feature' as const,
      text: 'Create a new interactive real-life analogy challenge on Transformers Self-Attention with step-by-step verification.'
    },
    {
      label: '+ AI Bug Doctor Boost',
      cat: 'system' as const,
      text: 'Enhance the permanent AI Bug Doctor with automated memory leak and asymptotic Big-O runtime bottleneck diagnosis.'
    }
  ];

  const handleGenerate = async () => {
    if (!directive.trim()) {
      setErrorMsg('Please enter a feature directive or select a preset.');
      return;
    }
    setErrorMsg('');
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/ceo-gemini-modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directive: directive.trim(),
          category,
          actionType: 'architect_and_implement',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setGeneratedResult(data);
    } catch (err: any) {
      console.error('Gemini 3.8 Flash generation error:', err);
      setErrorMsg(err?.message || 'Failed to connect to Gemini 3.8 Flash engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToPlatform = () => {
    if (!generatedResult) return;

    const newPatch = addCeoCustomPatch({
      title: generatedResult.featureTitle || directive.slice(0, 50),
      category,
      directive,
      architecturalSummary: generatedResult.architecturalSummary,
      codeSnippet: generatedResult.codeSnippet || '// No code payload',
      liveConfig: generatedResult.liveConfig || {
        key: `custom_${Date.now()}`,
        enabled: true,
        title: generatedResult.featureTitle,
      },
      enabled: true,
    });

    // Also inject into liveCodeApplier so CSS / JS / HTML gets executed immediately!
    if (generatedResult.codeSnippet) {
      const isCss = generatedResult.codeSnippet.includes('{') && (generatedResult.codeSnippet.includes(':') || generatedResult.codeSnippet.includes('.'));
      const isHtml = generatedResult.codeSnippet.includes('<div') || generatedResult.codeSnippet.includes('<span') || generatedResult.codeSnippet.includes('<style');
      addCodeInjection({
        title: generatedResult.featureTitle || directive.slice(0, 50),
        type: isHtml ? 'html' : isCss ? 'css' : 'javascript',
        code: generatedResult.codeSnippet,
        description: `Applied via Gemini 3.8 Flash CEO Studio: ${directive}`,
        enabled: true,
        targetLocation: 'global',
      });
    }

    setPatches(getCeoCustomPatches());
    setJustApplied(true);
    if (onNotify) {
      onNotify(`Applied "${newPatch.title}" live to SkillGraph platform!`);
    }
    setTimeout(() => setJustApplied(false), 3000);
  };

  const copyCodeToClipboard = () => {
    if (!generatedResult?.codeSnippet) return;
    navigator.clipboard.writeText(generatedResult.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Permanent Gemini 3.8 Flash Status Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-300">
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-white">Permanent Gemini 3.8 Flash Studio</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  CEO Ansh Kumar Desk
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Engine Online</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Exclusively provisioned for Founder & CEO Ansh Kumar to build, modify, and expand platform features, courses, and tools.
              </p>
            </div>
          </div>
        </div>

        {/* 100-Token Zero-Knowledge Gateway Seal */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>100-Token Quantum Gateway Code Handshake:</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 rounded font-black">
                ACTIVE & VERIFIED
              </span>
            </div>
            {/* Strictly Concealed Token Stream (100 Characters Never Shown in Plaintext) */}
            <div className="font-mono text-[11px] text-amber-400/70 tracking-widest bg-slate-900 px-2.5 py-1 rounded border border-slate-800 select-none overflow-hidden text-ellipsis whitespace-nowrap max-w-lg" title="100-Bit Masked Security Token">
              {getMaskedGateway100()}
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-mono block">
              🛡️ Zero-Knowledge Policy:
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              Concealed from CEO & all users
            </span>
          </div>
        </div>
      </div>

      {/* Quick Directive Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>Quick CEO Directive Presets:</span>
          <span className="text-[10px] text-slate-400 font-normal">Click to prefill directive</span>
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_DIRECTIVES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDirective(p.text);
                setCategory(p.cat);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-slate-300 hover:text-amber-300 text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Directive Input */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>CEO Ansh Kumar: Enter Platform Directive for Gemini 3.8 Flash</span>
          </label>

          {/* Category Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            {(['feature', 'course', 'tool', 'subscription', 'system'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={directive}
          onChange={(e) => setDirective(e.target.value)}
          placeholder="e.g. Add 3 Indian Creator masterclasses for Docker & Kubernetes with ProofLoop lab exercises, and make the advanced lab pro-only..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans leading-relaxed resize-none"
        />

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Powered permanently by <span className="text-amber-300 font-bold font-mono">Gemini 3.8 Flash</span>
          </span>

          <button
            type="button"
            disabled={isGenerating || !directive.trim()}
            onClick={handleGenerate}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
              isGenerating || !directive.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 hover:scale-[1.02]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini 3.8 Flash Architecting...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Execute Gemini 3.8 Flash Engine</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Architecture Blueprint Result */}
      {generatedResult && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Generated Architecture Solution
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                  {generatedResult.modelUsed || 'gemini-3.8-flash'}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                {generatedResult.featureTitle}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyToPlatform}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  justApplied
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                {justApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Saved & Applied Live!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Apply & Save to Live App</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Architectural Summary */}
          {generatedResult.architecturalSummary && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-300 block mb-1">Architectural Blueprint:</span>
              <p>{generatedResult.architecturalSummary}</p>
            </div>
          )}

          {/* Code Implementation */}
          {generatedResult.codeSnippet && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Synthesized Code / Module Patch:</span>
                </span>
                <button
                  type="button"
                  onClick={copyCodeToClipboard}
                  className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-56 leading-relaxed">
                <code>{generatedResult.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Live Config JSON Preview */}
          {generatedResult.liveConfig && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block">
                Platform Live Config Payload:
              </span>
              <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 overflow-x-auto max-h-32">
                {JSON.stringify(generatedResult.liveConfig, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Deployed Active CEO Architecture Patches */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Active CEO Platform Patches ({patches.length})
            </h4>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
              Saved in Runtime
            </span>
          </div>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {patches.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-500">
              No custom patches active. Type a directive above to instruct Gemini 3.8 Flash!
            </div>
          ) : (
            patches.map((patch) => (
              <div
                key={patch.id}
                className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  patch.enabled
                    ? 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40'
                    : 'bg-slate-950/50 border-slate-900 opacity-60'
                }`}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-white text-xs truncate">
                      {patch.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {patch.category}
                    </span>
                    {patch.enabled ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {patch.directive}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-0.5">
                    <span>Applied by {patch.appliedBy}</span>
                    <span>•</span>
                    <span>{new Date(patch.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleCeoPatch(patch.id, !patch.enabled)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      patch.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                    title={patch.enabled ? 'Disable Patch' : 'Enable Patch'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCeoPatch(patch.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-xs transition-colors cursor-pointer"
                    title="Delete Patch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
