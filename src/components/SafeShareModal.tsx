import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Globe2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  QrCode,
  MessageCircle
} from 'lucide-react';

interface SafeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl?: string;
}

export const SafeShareModal: React.FC<SafeShareModalProps> = ({
  isOpen,
  onClose,
  sharedUrl = 'https://ais-pre-ynjgiuxez2dfchcgrbcxu4-994597833907.asia-east1.run.app'
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // The guaranteed clean URL for users (no admin keys, strictly user mode)
  const safeUserUrl = sharedUrl.includes('?') 
    ? sharedUrl.split('?')[0] 
    : sharedUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(safeUserUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    `🚀 Check out SkillGraph! Master Coding, Python, JavaScript, and AI with video masterclasses, Flow AI video generator, and Web Dev Studio: ${safeUserUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  // Simple clean SVG QR code placeholder generator for the URL
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(safeUserUrl)}&color=6366f1&bgcolor=0f172a`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Safe User Share Link</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tamper Proof
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Send this link to anyone. They will only get the clean student view with zero admin access.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-emerald-200 block">
              Platform Security & Privacy Guarantee
            </span>
            <span className="text-emerald-300/80 leading-relaxed block mt-0.5">
              Anyone opening this link cannot touch, modify, or tamper with your app settings, servers, database, or CEO controls. They only experience the smooth, high-speed Play Store-quality learning app.
            </span>
          </div>
        </div>

        {/* Safe User Link Card */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              Public Safe URL for Students & Users
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">100% Protected</span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex-1 px-3 py-2 text-xs font-mono text-slate-300 truncate select-all flex items-center bg-slate-900/60 rounded-xl">
              {safeUserUrl}
            </div>

            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-95'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied! Safe Link</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Safe Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sharing Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all group"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Share on WhatsApp</span>
          </a>

          {/* QR Code Toggle */}
          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>{showQr ? 'Hide QR Code' : 'Show Mobile QR Code'}</span>
          </button>
        </div>

        {/* QR Code Preview Box */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
            <p className="text-xs text-slate-400">
              Users can scan this with any phone camera (Android or iPhone) to instantly open the safe user app:
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/20 shadow-inner">
              <img 
                src={qrSvgUrl} 
                alt="Safe User Link QR Code" 
                className="w-44 h-44 rounded-lg"
              />
            </div>
            <span className="text-[11px] font-mono text-indigo-400">
              Scans directly to Safe Public Edition
            </span>
          </div>
        )}

        {/* Security & Features Checklist */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 block">
            What Users Will & Won't See:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>YouTube Creator Video Academy</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Flow AI 10-Second Video Studio</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Web Dev Studio with Sandbox</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Grok AI Reasoning & Live Code</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>₹99 Lifetime All-Access Pass</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-red-300">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>NO CEO Admin Controls button</span>
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>NO curriculum reset / delete</span>
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>NO server cluster tampering</span>
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>NO developer mode overrides</span>
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>NO access to founder controls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <a
            href={safeUserUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Test Safe Link in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
