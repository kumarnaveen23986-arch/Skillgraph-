// ============================================================
// SkillGraph Live Code Injector & Cross-Device Cloud Sync Engine
// Automatically synchronizes all custom code, styles, and changes
// across web, dev, and the downloaded/installed mobile app (PWA/Android).
// ============================================================

export interface CodeInjection {
  id: string;
  title: string;
  type: 'css' | 'javascript' | 'html' | 'config';
  code: string;
  enabled: boolean;
  createdAt: string;
  description?: string;
  targetLocation?: 'global' | 'banner' | 'widget_dock' | 'notification';
  executionLog?: string;
}

const STORAGE_KEY = 'sg_custom_code_injections';
const VERSION_KEY = 'sg_injections_server_version';

// Get all saved code injections from local device cache
export function getSavedInjections(): CodeInjection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultInjections();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getDefaultInjections();
  } catch (err) {
    console.warn('Failed to parse saved code injections:', err);
    return getDefaultInjections();
  }
}

// Save code injections locally and push to cloud server for installed app
export function saveInjections(injections: CodeInjection[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(injections));
    window.dispatchEvent(new CustomEvent('sg-injections-updated', { detail: injections }));
    
    // Automatically push to cloud server so downloaded app receives it!
    pushInjectionsToServer(injections);
  } catch (err) {
    console.error('Failed to save code injections:', err);
  }
}

// Push all injections to backend server so installed mobile apps receive it
async function pushInjectionsToServer(injections: CodeInjection[]): Promise<boolean> {
  try {
    const res = await fetch('/api/live-injections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ injections }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.version) {
        localStorage.setItem(VERSION_KEY, String(data.version));
      }
      window.dispatchEvent(new CustomEvent('sg-cloud-sync-status', { 
        detail: { status: 'synced', timestamp: new Date().toISOString() } 
      }));
      return true;
    }
  } catch (e) {
    console.warn('[Cloud Sync] Offline or server unreachable, changes cached locally:', e);
  }
  return false;
}

// Add a new code injection, apply it locally and push to cloud
export function addCodeInjection(
  item: Omit<CodeInjection, 'id' | 'createdAt'>
): { injection: CodeInjection; success: boolean; log: string } {
  const current = getSavedInjections();
  const newInjection: CodeInjection = {
    ...item,
    id: `injection-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  let executionLog = 'Saved successfully.';
  let success = true;

  if (newInjection.enabled) {
    const applyResult = applySingleInjection(newInjection);
    success = applyResult.success;
    executionLog = applyResult.log;
    newInjection.executionLog = executionLog;
  }

  const updated = [newInjection, ...current];
  saveInjections(updated);
  return { injection: newInjection, success, log: executionLog };
}

// Toggle an injection on/off
export function toggleCodeInjection(id: string, enabled: boolean): { success: boolean; log: string } {
  const current = getSavedInjections();
  let log = '';
  let success = true;

  const updated = current.map((item) => {
    if (item.id === id) {
      if (!enabled) {
        removeSingleInjection(item.id, item.type);
        log = `Deactivated "${item.title}".`;
      } else {
        const res = applySingleInjection({ ...item, enabled: true });
        log = res.log;
        success = res.success;
      }
      return { ...item, enabled, executionLog: log };
    }
    return item;
  });

  saveInjections(updated);
  return { success, log };
}

// Delete an injection locally and on server
export function deleteCodeInjection(id: string): void {
  const current = getSavedInjections();
  const target = current.find((i) => i.id === id);
  if (target) {
    removeSingleInjection(target.id, target.type);
  }
  const updated = current.filter((i) => i.id !== id);
  saveInjections(updated);

  // Inform backend to delete
  fetch(`/api/live-injections/${id}`, { method: 'DELETE' }).catch(() => {});
}

// Apply a single injection live into the browser environment
export function applySingleInjection(injection: CodeInjection): { success: boolean; log: string } {
  try {
    if (!injection.code || !injection.code.trim()) {
      return { success: false, log: 'Code is empty.' };
    }

    if (injection.type === 'css') {
      // 1. CSS Stylesheet Injection into document.head
      const styleId = `sg-custom-css-${injection.id}`;
      let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.setAttribute('data-sg-custom', injection.id);
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = injection.code;
      return { success: true, log: `CSS injected into <head> with id #${styleId}. Styles are live!` };
    }

    if (injection.type === 'javascript') {
      // 2. JavaScript / Logic Execution
      // Provide safe sandbox API via window.SkillGraphCustom
      (window as any).SkillGraphCustom = {
        showNotification: (msg: string) => {
          window.dispatchEvent(new CustomEvent('sg-show-toast', { detail: { message: msg } }));
        },
        addBonusXp: (amount: number) => {
          try {
            const raw = localStorage.getItem('sg_user_progress');
            if (raw) {
              const p = JSON.parse(raw);
              p.xp = (p.xp || 0) + amount;
              localStorage.setItem('sg_user_progress', JSON.stringify(p));
              window.dispatchEvent(new CustomEvent('pro-request-updated'));
            }
          } catch (e) {}
        },
        navigateTo: (tab: string) => {
          window.dispatchEvent(new CustomEvent('sg-navigate-tab', { detail: { tab } }));
        },
      };

      // Execute script cleanly
      const runner = new Function(injection.code);
      const res = runner();
      const outputMsg = res !== undefined ? String(res) : 'Executed successfully without runtime errors.';
      return { success: true, log: `JavaScript executed successfully. Output: ${outputMsg}` };
    }

    if (injection.type === 'html') {
      // 3. HTML / Banner / Widget Injection
      let container = document.getElementById('sg-dynamic-widgets-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'sg-dynamic-widgets-container';
        container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 my-3 space-y-3';
        const main = document.querySelector('main');
        if (main && main.parentNode) {
          main.parentNode.insertBefore(container, main);
        } else {
          document.body.appendChild(container);
        }
      }

      const widgetId = `sg-dynamic-html-${injection.id}`;
      let widgetDiv = document.getElementById(widgetId);
      if (!widgetDiv) {
        widgetDiv = document.createElement('div');
        widgetDiv.id = widgetId;
        widgetDiv.className = 'animate-fadeIn transition-all';
        container.prepend(widgetDiv);
      }
      widgetDiv.innerHTML = injection.code;
      return { success: true, log: `HTML widget mounted live into #${widgetId} successfully.` };
    }

    if (injection.type === 'config') {
      // 4. JSON Config / Feature Flags
      const parsed = JSON.parse(injection.code);
      localStorage.setItem(`sg_config_${injection.id}`, JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('sg-config-updated', { detail: { id: injection.id, config: parsed } }));
      return { success: true, log: `JSON Config verified and saved to active app feature flags.` };
    }

    return { success: true, log: 'Applied successfully.' };
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error(`[Code Applier Error in ${injection.title}]:`, err);
    return { success: false, log: `Execution Error: ${errorMsg}` };
  }
}

// Remove a single injection from the DOM
export function removeSingleInjection(id: string, type: 'css' | 'javascript' | 'html' | 'config'): void {
  try {
    if (type === 'css') {
      const el = document.getElementById(`sg-custom-css-${id}`);
      if (el) el.remove();
    } else if (type === 'html') {
      const el = document.getElementById(`sg-dynamic-html-${id}`);
      if (el) el.remove();
    } else if (type === 'config') {
      localStorage.removeItem(`sg_config_${id}`);
    }
  } catch (e) {
    console.warn('Error removing injection:', e);
  }
}

// Apply all active saved injections (called on app startup)
export function applyAllActiveInjections(): void {
  const injections = getSavedInjections();
  injections.forEach((item) => {
    if (item.enabled) {
      applySingleInjection(item);
    }
  });

  // Pull latest updates from cloud server immediately
  syncWithServer();
}

// 🔄 CLOUD SYNC: Pull latest injections from server (for downloaded/installed mobile apps)
export async function syncWithServer(): Promise<{ synced: boolean; count: number; error?: string }> {
  try {
    const res = await fetch('/api/live-injections', {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!res.ok) {
      return { synced: false, count: 0, error: `Server HTTP ${res.status}` };
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.injections)) {
      const serverInjections: CodeInjection[] = data.injections;
      const localVersion = localStorage.getItem(VERSION_KEY);
      
      // If server version is different or local storage is empty, synchronize!
      if (String(data.version) !== localVersion || !localStorage.getItem(STORAGE_KEY)) {
        // Clean up any old injected style tags that are no longer present
        const currentLocal = getSavedInjections();
        const serverIds = new Set(serverInjections.map(i => i.id));
        currentLocal.forEach(localItem => {
          if (!serverIds.has(localItem.id)) {
            removeSingleInjection(localItem.id, localItem.type);
          }
        });

        // Store server injections into localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverInjections));
        if (data.version) {
          localStorage.setItem(VERSION_KEY, String(data.version));
        }

        // Apply all server active injections to DOM
        serverInjections.forEach((item) => {
          if (item.enabled) {
            applySingleInjection(item);
          } else {
            removeSingleInjection(item.id, item.type);
          }
        });

        window.dispatchEvent(new CustomEvent('sg-injections-updated', { detail: serverInjections }));
        window.dispatchEvent(new CustomEvent('sg-cloud-sync-status', { 
          detail: { status: 'synced', count: serverInjections.length, timestamp: new Date().toISOString() } 
        }));
      }

      return { synced: true, count: serverInjections.length };
    }
  } catch (err: any) {
    console.warn('[LiveCodeSync] Could not reach sync server:', err?.message || err);
    return { synced: false, count: 0, error: err?.message };
  }
  return { synced: false, count: 0 };
}

// Manual force sync trigger (used by buttons)
export async function forceCloudSyncToDownloadedApp(): Promise<{ success: boolean; message: string }> {
  const current = getSavedInjections();
  const pushSuccess = await pushInjectionsToServer(current);
  if (pushSuccess) {
    // Notify Service Worker if available to invalidate cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }
    return {
      success: true,
      message: 'Cloud Sync Successful! Changes are now live on your downloaded app on your phone.'
    };
  }
  return {
    success: false,
    message: 'Could not reach server. Check network connection.'
  };
}

// Automatic background sync initializer (runs once on startup)
export function initLiveCodeApplier(): void {
  // 1. Apply existing local injections immediately
  applyAllActiveInjections();

  // 2. Sync with server immediately
  syncWithServer();

  // 3. Whenever user switches to downloaded app / tab, pull latest changes
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => {
      syncWithServer();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    });

    // 4. Background polling every 12 seconds
    setInterval(() => {
      syncWithServer();
    }, 12000);
  }
}

// Default initial sample injections
function getDefaultInjections(): CodeInjection[] {
  return [
    {
      id: 'default-html-banner',
      title: 'Live CEO Announcement Banner (HTML Widget)',
      type: 'html',
      code: `<div class="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/40 text-xs flex items-center justify-between gap-3 shadow-lg">
  <div class="flex items-center gap-2.5">
    <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
    <span class="font-bold text-white">✨ Live Custom Code Injector Active</span>
    <span class="text-slate-300 hidden sm:inline">• Code pasted from Gemini 3.8 Flash is evaluated and applied instantly</span>
  </div>
  <span class="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">GEMINI 3.8 LIVE</span>
</div>`,
      enabled: true,
      createdAt: new Date().toISOString(),
      description: 'Interactive HTML widget banner injected at the top of the app.',
      targetLocation: 'banner',
      executionLog: 'Active.',
    },
    {
      id: 'default-css-glow',
      title: 'Neon Amber Card Hover Glow (CSS)',
      type: 'css',
      code: `/* Custom Neon Hover Effects */
.group:hover {
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
  transition: all 0.3s ease-in-out;
}`,
      enabled: false,
      createdAt: new Date().toISOString(),
      description: 'Adds a subtle neon amber glow effect when hovering over cards in SkillGraph.',
      targetLocation: 'global',
      executionLog: 'Ready to enable.',
    },
  ];
}
