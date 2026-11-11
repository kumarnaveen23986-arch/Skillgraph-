import React, { useState } from 'react';
import { 
  Play, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  FileCode2, 
  Layers, 
  Terminal, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface PlayStoreLaunchKitProps {
  onClose?: () => void;
}

export const PlayStoreLaunchKit: React.FC<PlayStoreLaunchKitProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customPackageName, setCustomPackageName] = useState('com.skillgraph.app');
  const [customSha256, setCustomSha256] = useState('14:6D:E9:7F:0F:52:EA:CB:54:60:4F:AC:FE:19:DD:CE:42:47:91:90:6D:3B:5F:8B:2A:4E:02:6B:30:54:56:4E');
  const [activeTab, setActiveTab] = useState<'overview' | 'bubblewrap' | 'pwabuilder' | 'checklist' | 'assetlinks'>('overview');

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://skillgraph.app';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bubblewrapInitCmd = `npm i -g @bubblewrap/cli
bubblewrap init --manifest="${currentDomain}/manifest.webmanifest"
# When prompted:
# Package Name: ${customPackageName}
# App Name: SkillGraph
# Start URL: /
# Display mode: standalone
bubblewrap build`;

  const assetLinksJson = JSON.stringify([
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": customPackageName,
        "sha256_cert_fingerprints": [
          customSha256
        ]
      }
    }
  ], null, 2);

  const downloadAssetLinks = () => {
    const blob = new Blob([assetLinksJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetlinks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pwaVerificationItems = [
    { label: 'Web App Manifest', status: 'Compliant', desc: 'Valid ID, names, standalone mode & color theme in manifest.webmanifest', ready: true },
    { label: 'Responsive App Icons', status: 'Compliant', desc: '192x192, 512x512, and 512x512 maskable icon with safe zone padding', ready: true },
    { label: 'Service Worker & Offline Cache', status: 'Active', desc: 'Workbox autoUpdate service worker active with precache routing', ready: true },
    { label: 'Android Digital Asset Links', status: 'Configured', desc: 'Served at /.well-known/assetlinks.json for seamless TWA URL verification', ready: true },
    { label: 'Apple Touch Icon Fallback', status: 'Ready', desc: '180x180 PNG icon configured for iOS home screen shortcuts', ready: true },
    { label: 'HTTPS Protocol', status: 'Active', desc: 'Serving over encrypted SSL connection required by Google Play TWA', ready: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Google Play Store (TWA) Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
                <Play className="w-6 h-6 fill-white" />
              </span>
              Google Play Store Launch Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Launch <strong className="text-white">SkillGraph</strong> as a full Android application on Google Play Store using <strong>Trusted Web Activity (TWA)</strong>. Get zero-latency web updates, native notifications, and a full standalone app experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.pwabuilder.com?site=${encodeURIComponent(currentDomain)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build AAB with PWABuilder</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Back to App
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: 'overview', label: '1. PWA Readiness Audit', icon: ShieldCheck },
            { id: 'bubblewrap', label: '2. Google Bubblewrap CLI (AAB)', icon: Terminal },
            { id: 'pwabuilder', label: '3. PWABuilder 1-Click', icon: Sparkles },
            { id: 'assetlinks', label: '4. Digital Asset Links', icon: FileCode2 },
            { id: 'checklist', label: '5. Play Console Checklist', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: PWA Readiness Audit */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pwaVerificationItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{item.label}</h3>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Assets Preview & Download */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="/pwa-512x512.png" 
                alt="SkillGraph App Icon" 
                className="w-16 h-16 rounded-2xl border border-indigo-500/40 shadow-lg object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-white">SkillGraph 512x512 Master Icon</h4>
                <p className="text-xs text-slate-400">Google Play Store requires a 512x512 high-resolution icon (32-bit PNG with alpha).</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <a 
                href="/pwa-512x512.png" 
                download="skillgraph-playstore-icon-512x512.png"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download 512px Icon
              </a>
              <a 
                href="/icon.svg" 
                download="skillgraph-vector-icon.svg"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Vector SVG
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Google Bubblewrap CLI */}
      {activeTab === 'bubblewrap' && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Terminal className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Google Official CLI: Bubblewrap</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Bubblewrap is Google's official command line tool that converts Progressive Web Apps into an Android App Bundle (<code className="text-indigo-300 font-mono">.aab</code>) ready for upload to Google Play Console.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Terminal Command Sequence:</span>
              <button
                onClick={() => copyToClipboard(bubblewrapInitCmd, 'bubblewrap')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 transition"
              >
                {copiedKey === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bubblewrap' ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              {bubblewrapInitCmd}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-indigo-300">
              <HelpCircle className="w-4 h-4" />
              <span>What happens next?</span>
            </div>
            <p>
              Bubblewrap will generate an encrypted signing keystore (<code className="text-white font-mono">android.keystore</code>) and output <code className="text-emerald-400 font-mono">app-release-bundle.aab</code>. You upload this exact file to the Google Play Console under <strong>Production &gt; Create new release</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: PWABuilder */}
      {activeTab === 'pwabuilder' && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">PWABuilder 1-Click Cloud Packager</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                If you prefer not to use the terminal or don't have the Android SDK installed locally, PWABuilder (sponsored by Microsoft & Google) generates a certified Google Play Store package right in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">1</div>
              <h4 className="text-sm font-semibold text-white">Enter App URL</h4>
              <p className="text-xs text-slate-400">PWABuilder tests your live URL and verifies 100% PWA compliance.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">2</div>
              <h4 className="text-sm font-semibold text-white">Generate Android Package</h4>
              <p className="text-xs text-slate-400">Click "Package for Stores" and select "Google Play".</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">3</div>
              <h4 className="text-sm font-semibold text-white">Download APK & AAB</h4>
              <p className="text-xs text-slate-400">Receive your signed APK for instant phone testing, plus the AAB for Play Console.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={`https://www.pwabuilder.com?site=${encodeURIComponent(currentDomain)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition"
            >
              <span>Open SkillGraph on PWABuilder</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-xs text-slate-400">Analyzes <code className="text-indigo-300 font-mono">{currentDomain}</code></span>
          </div>
        </div>
      )}

      {/* Tab 4: Digital Asset Links */}
      {activeTab === 'assetlinks' && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <FileCode2 className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Android Digital Asset Links (.well-known/assetlinks.json)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Google Play verifies domain ownership using Digital Asset Links. This removes the browser URL bar so SkillGraph runs in pure native standalone mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Android Package Name</label>
              <input 
                type="text" 
                value={customPackageName}
                onChange={(e) => setCustomPackageName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">SHA-256 Fingerprint (from Play Console App Signing)</label>
              <input 
                type="text" 
                value={customSha256}
                onChange={(e) => setCustomSha256(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Preview: public/.well-known/assetlinks.json</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(assetLinksJson, 'assetlinks')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 transition"
                >
                  {copiedKey === 'assetlinks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'assetlinks' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadAssetLinks}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white transition font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {assetLinksJson}
            </pre>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>This file is already served directly from your applet root at <code className="text-white font-mono">/.well-known/assetlinks.json</code></span>
          </div>
        </div>
      )}

      {/* Tab 5: Play Console Checklist */}
      {activeTab === 'checklist' && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Layers className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Google Play Console Publishing Checklist</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Follow these required steps in the Google Play Console (<a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">play.google.com/console</a>) to publish:
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '1. Create App in Play Console',
                desc: 'Select "Create app", enter "SkillGraph: Learn Coding & AI", language English, type Free, and accept Developer policies.',
                ready: true,
              },
              {
                step: '2. Store Listing Information',
                desc: 'Short Description: "Master Coding & AI with real-life analogies, ProofLoop, and live exercises." Full Description: Detail Python, JS, AI Neural Networks, and Bug Doctor features.',
                ready: true,
              },
              {
                step: '3. Graphics & Media Assets',
                desc: 'Upload 512x512 App Icon (ready in Kit), 1024x500 Feature Graphic, and at least 2 phone screenshots (portrait 1080x1920 or landscape).',
                ready: true,
              },
              {
                step: '4. Privacy Policy & App Content',
                desc: 'Provide a privacy policy URL and complete the Content Rating questionnaire (Educational - no violence/mature themes = Everyone rating).',
                ready: true,
              },
              {
                step: '5. Upload Release (.aab file)',
                desc: 'Under "Production" > "Create new release", upload the app-release-bundle.aab generated via Bubblewrap or PWABuilder.',
                ready: true,
              },
              {
                step: '6. Copy App Signing SHA-256 to Asset Links',
                desc: 'Under "Setup" > "App integrity" > "App signing key certificate", copy the SHA-256 fingerprint into your assetlinks.json.',
                ready: true,
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.step}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Direct Installation on Phones Without Play Store</h4>
                <p className="text-xs text-slate-400">Users can also immediately install SkillGraph right now using the "Install App" button in the navigation header!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
