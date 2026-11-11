import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner';
  onOpenPlayStoreKit?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'navbar',
  onOpenPlayStoreKit 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Install SkillGraph on Your Device</h4>
              <p className="text-xs text-slate-400">Run standalone offline, fast loading, no browser address bar.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenPlayStoreKit && (
              <button
                onClick={onOpenPlayStoreKit}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                Play Store Kit
              </button>
            )}
            <button
              onClick={install}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md transition"
            >
              <Download className="w-3.5 h-3.5" />
              Install Now
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:from-indigo-500 hover:to-indigo-400 transition transform active:scale-95"
        title="Install SkillGraph on your phone or desktop"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900/50 transition"
          title="Install on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white">Install SkillGraph on iPhone & iPad</h3>
              <p className="mt-1 text-xs text-slate-400">Install as a native full-screen app via Safari:</p>

              <div className="mt-4 space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-800 text-indigo-400 mt-0.5">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">1. Tap Share</span>
                    <p className="text-slate-400 text-[11px]">Tap the Safari Share icon at the bottom toolbar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-800 text-indigo-400 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">2. Add to Home Screen</span>
                    <p className="text-slate-400 text-[11px]">Scroll down the menu and tap 'Add to Home Screen'.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that haven't fired beforeinstallprompt yet or desktop
  return (
    <button
      onClick={() => onOpenPlayStoreKit?.()}
      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
      title="View Play Store / Mobile installation instructions"
    >
      <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
      <span className="hidden sm:inline">Install / Play Store</span>
    </button>
  );
};
