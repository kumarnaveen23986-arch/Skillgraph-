import React, { useState, useMemo } from 'react';
import { 
  X, 
  WifiOff, 
  CheckCircle2, 
  BookOpen, 
  Code2, 
  Copy, 
  Check, 
  Clock, 
  Search, 
  FileText, 
  Sparkles, 
  Play, 
  RotateCw,
  Award,
  Layers,
  Database
} from 'lucide-react';
import { 
  CachedModuleItem, 
  getCachedCompletedModules, 
  saveModuleOfflineNote, 
  getCacheMetadata 
} from '../utils/storage';
import { UserProgress } from '../types';

interface OfflineModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onOpenCodeLab: (code: string) => void;
  isOnline: boolean;
}

export const OfflineModulesModal: React.FC<OfflineModulesModalProps> = ({
  isOpen,
  onClose,
  progress,
  onOpenCodeLab,
  isOnline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedNoteSuccess, setSavedNoteSuccess] = useState<string | null>(null);

  const cachedModules = useMemo(() => {
    return getCachedCompletedModules();
  }, [isOpen, progress.completedVideoLessons]);

  const metadata = useMemo(() => {
    return getCacheMetadata();
  }, [isOpen]);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return cachedModules;
    const q = searchQuery.toLowerCase();
    return cachedModules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.courseTitle.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.keyConcepts.some((c) => c.toLowerCase().includes(q))
    );
  }, [cachedModules, searchQuery]);

  const selectedModule = useMemo(() => {
    if (selectedModuleId) {
      return cachedModules.find((m) => m.id === selectedModuleId) || cachedModules[0];
    }
    return cachedModules[0] || null;
  }, [cachedModules, selectedModuleId]);

  if (!isOpen) return null;

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNote = (moduleId: string) => {
    const currentNote = notes[moduleId] ?? selectedModule?.notes ?? '';
    saveModuleOfflineNote(moduleId, currentNote);
    setSavedNoteSuccess(moduleId);
    setTimeout(() => setSavedNoteSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-2xl p-0.5 shadow-lg shrink-0 ${
              isOnline ? 'bg-gradient-to-tr from-indigo-500 to-cyan-500' : 'bg-gradient-to-tr from-amber-500 to-orange-500'
            }`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                {isOnline ? (
                  <Database className="w-5 h-5 text-cyan-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-amber-400 animate-pulse" />
                )}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white truncate">
                  Cached Completed Modules (Offline Ready)
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isOnline
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                }`}>
                  {isOnline ? 'Online Synced' : 'Offline Mode Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {cachedModules.length} completed modules cached locally in browser memory • Accessible with zero internet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Metadata Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cached modules, concepts, or topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0 font-mono">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{cachedModules.length} Modules Cached</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Last Cached: {new Date(metadata.lastCachedAt).toLocaleTimeString()}</span>
            </span>
          </div>
        </div>

        {/* Content Body: Master-Detail Split View */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left: Modules List Sidebar */}
          <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 p-3 sm:p-4 overflow-y-auto space-y-2 shrink-0 max-h-56 md:max-h-none">
            {filteredModules.length === 0 ? (
              <div className="text-center py-10 space-y-2 text-slate-500">
                <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No cached modules found matching your query.</p>
              </div>
            ) : (
              filteredModules.map((m) => {
                const isSelected = selectedModule?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModuleId(m.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                        Lesson #{m.lessonNumber}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Completed ✓</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                      {m.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[160px] text-slate-300">{m.courseTitle}</span>
                      <span className="font-mono text-cyan-300">{m.duration}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Selected Module Details & Offline Code / Notes */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            {selectedModule ? (
              <div className="space-y-6">
                {/* Module Title & Creator */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                      {selectedModule.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedModule.duration}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {selectedModule.title}
                    </h3>
                    <p className="text-xs text-indigo-300 font-medium">
                      Course: {selectedModule.courseTitle} • By {selectedModule.creatorName}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="pt-2 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedModule.summary}
                  </div>
                </div>

                {/* Key Concepts Bullet Points */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mastered Key Concepts:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedModule.keyConcepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Code Box (Offline Executable) */}
                {selectedModule.suggestedStarterCode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Offline Practice Code ({selectedModule.practiceLanguage || 'Code'}):</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(selectedModule.suggestedStarterCode!, selectedModule.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                        >
                          {copiedId === selectedModule.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenCodeLab(selectedModule.suggestedStarterCode!);
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Run in Code Lab (Offline)</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-56 leading-relaxed">
                      <pre>{selectedModule.suggestedStarterCode}</pre>
                    </div>
                  </div>
                )}

                {/* Personal Offline Notes */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>My Offline Study Notes:</span>
                    </span>
                    {savedNoteSuccess === selectedModule.id && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                        <Check className="w-3.5 h-3.5" />
                        <span>Notes Saved to Offline Cache!</span>
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={notes[selectedModule.id] ?? selectedModule.notes ?? ''}
                    onChange={(e) => setNotes({ ...notes, [selectedModule.id]: e.target.value })}
                    placeholder="Write your personal insights, cheat-sheet formulas, or memory hooks for this module..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveNote(selectedModule.id)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      Save Offline Note
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 space-y-3 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
                <h4 className="text-sm font-bold text-slate-300">No Module Selected</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Select a completed module from the list on the left to review its offline notes, concepts, and code.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SkillGraph Offline Storage Engine Active • All notes and completed modules persist locally.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
