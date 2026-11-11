import React, { useState } from 'react';
import { 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  BookOpen, 
  RefreshCw, 
  Layers, 
  ChevronRight, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getCachedCompletedModules } from '../utils/storage';

interface OfflineIndicatorProps {
  onOpenOfflineModules: () => void;
  cachedModulesCount?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onOpenOfflineModules,
  cachedModulesCount,
}) => {
  const { isOnline, isSimulated, justReconnected, toggleSimulateOffline } = useOnlineStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  const count = cachedModulesCount ?? getCachedCompletedModules().length;

  // Case 1: Back online toast notification (4 seconds)
  if (isOnline && justReconnected) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 animate-bounce">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-500/30 border border-emerald-400/50 text-xs font-bold">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <span className="block font-black">Connection Restored!</span>
            <span className="text-[10px] text-emerald-100 font-normal">
              All progress, XP, and completed modules are synced.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Online and not simulated -> nothing to show or subtle minimal indicator
  if (isOnline) {
    return null;
  }

  // Case 3: Offline mode active (Actual or Simulated)
  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-slate-950 font-black text-[11px] shadow-xl border border-amber-400 hover:scale-105 transition cursor-pointer"
        title="Offline Mode Active - Click to expand"
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline ({count})</span>
      </button>
    );
  }

  return (
    <aside 
      aria-label="Offline Mode Notification"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-40 max-w-md animate-slideUp"
    >
      <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/95 via-slate-900/95 to-amber-950/95 border border-amber-500/50 text-slate-100 shadow-2xl backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <WifiOff className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300">
                  {isSimulated ? 'Offline Mode (Simulated)' : 'You Are Offline'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  CACHED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Viewing cached progress • {count} completed {count === 1 ? 'module' : 'modules'} accessible
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Minimize offline banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={onOpenOfflineModules}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Cached Modules</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={toggleSimulateOffline}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition cursor-pointer"
            title={isSimulated ? 'Switch back to online mode' : 'Simulate offline state to test caching'}
          >
            {isSimulated ? 'Turn Online' : 'Simulate'}
          </button>
        </div>
      </div>
    </aside>
  );
};
