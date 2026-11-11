import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Mail, 
  Search, 
  Upload, 
  Send, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  FileCode, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Lock,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { 
  initWorkspaceAuth, 
  googleSignIn, 
  logoutWorkspace, 
  getAccessToken 
} from '../services/workspaceAuth';
import { 
  listDriveFiles, 
  createDriveFile, 
  deleteDriveFile, 
  DriveFile 
} from '../services/driveService';
import { 
  listGmailMessages, 
  sendGmailMessage, 
  GmailMessageSummary 
} from '../services/gmailService';
import { UserProgress } from '../types';

interface GoogleWorkspaceHubProps {
  progress?: UserProgress;
  onOpenCodeLab?: (code: string) => void;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({
  progress,
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'gmail'>('drive');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveSearch, setDriveSearch] = useState('');
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSuccessToast, setDriveSuccessToast] = useState<string | null>(null);

  // Drive upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('SkillGraph-Learning-Notes.txt');
  const [uploadFileContent, setUploadFileContent] = useState(
    `SkillGraph Learning Record\nGenerated on: ${new Date().toLocaleString()}\nXP: ${progress?.xp || 100}\nStreak: ${progress?.streak || 1} Days\n\nTopics Mastered:\n- Python & JavaScript Foundations\n- 5-Stage ProofLoop™ Methodology\n- Neural Networks & AI Architecture`
  );
  const [isUploading, setIsUploading] = useState(false);

  // Drive delete confirmation modal
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Gmail state
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [isLoadingGmail, setIsLoadingGmail] = useState(false);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [gmailSuccessToast, setGmailSuccessToast] = useState<string | null>(null);

  // Gmail compose modal
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('SkillGraph Learning Progress Report');
  const [emailBody, setEmailBody] = useState(
    `Hi,\n\nI am studying on SkillGraph! Here is my progress:\n- Total XP: ${progress?.xp || 100}\n- Current Streak: ${progress?.streak || 1} Days\n- Completed Exercises: ${progress?.completedExercises?.length || 0}\n\nSkillGraph ProofLoop™ helps me master concepts with real-world physical analogies!\n\nBest regards,\nStudent Learner`
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (user, accessToken) => {
        setCurrentUser(user);
        setToken(accessToken);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive files when token is ready and tab is drive
  useEffect(() => {
    if (token && activeTab === 'drive') {
      fetchDriveFiles();
    }
  }, [token, activeTab]);

  // Fetch Gmail messages when token is ready and tab is gmail
  useEffect(() => {
    if (token && activeTab === 'gmail') {
      fetchGmailMessages();
    }
  }, [token, activeTab]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutWorkspace();
    setCurrentUser(null);
    setToken(null);
    setDriveFiles([]);
    setEmails([]);
  };

  // Drive functions
  const fetchDriveFiles = async (query?: string) => {
    if (!token) return;
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const files = await listDriveFiles(token, query ?? driveSearch);
      setDriveFiles(files);
    } catch (err: any) {
      setDriveError(err.message || 'Could not load Google Drive files');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!token) return;
    setIsUploading(true);
    setDriveError(null);
    try {
      const newFile = await createDriveFile(token, uploadFileName, uploadFileContent);
      setDriveSuccessToast(`Successfully uploaded "${newFile.name}" to Google Drive!`);
      setTimeout(() => setDriveSuccessToast(null), 4000);
      setIsUploadModalOpen(false);
      fetchDriveFiles();
    } catch (err: any) {
      setDriveError(err.message || 'Failed to upload to Google Drive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setDriveSuccessToast(`Deleted "${fileToDelete.name}" from Google Drive.`);
      setTimeout(() => setDriveSuccessToast(null), 3000);
      setFileToDelete(null);
      fetchDriveFiles();
    } catch (err: any) {
      setDriveError(err.message || 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  // Gmail functions
  const fetchGmailMessages = async (query?: string) => {
    if (!token) return;
    setIsLoadingGmail(true);
    setGmailError(null);
    try {
      const msgs = await listGmailMessages(token, 15, query ?? emailSearch);
      setEmails(msgs);
    } catch (err: any) {
      setGmailError(err.message || 'Could not load Gmail inbox');
    } finally {
      setIsLoadingGmail(false);
    }
  };

  const handleConfirmSendEmail = async () => {
    if (!token) return;
    if (!recipientEmail || !recipientEmail.includes('@')) {
      alert('Please enter a valid recipient email address');
      return;
    }
    setIsSendingEmail(true);
    setGmailError(null);
    try {
      await sendGmailMessage(token, recipientEmail.trim(), emailSubject, emailBody);
      setGmailSuccessToast(`Email successfully sent to ${recipientEmail}!`);
      setTimeout(() => setGmailSuccessToast(null), 4000);
      setShowSendConfirmation(false);
      setIsComposeModalOpen(false);
      fetchGmailMessages();
    } catch (err: any) {
      setGmailError(err.message || 'Failed to send email via Gmail');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-red-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Workspace Integration</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">1P Official APIs</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Google Drive & Gmail Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Export study notes, code solutions, and proof milestones directly to your Google Drive, or send personalized learning summaries to your mentor or yourself via Gmail.
            </p>
          </div>

          {/* Account Authentication Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl min-w-[280px]">
            {token && currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Connected to Google</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[10px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-9 h-9 rounded-full border border-indigo-500/50" 
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {currentUser.displayName || 'Google User'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-300 block">Connect Workspace Account</span>
                <p className="text-[11px] text-slate-400">
                  Sign in with Google to access your Drive files and Gmail securely.
                </p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'drive'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4 text-blue-400" />
          <span>Google Drive Explorer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gmail'
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Mail className="w-4 h-4 text-red-400" />
          <span>Gmail Communication Hub</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GOOGLE DRIVE STUDIO                               */}
      {/* ======================================================== */}
      {activeTab === 'drive' && (
        <div className="space-y-4">
          {driveSuccessToast && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{driveSuccessToast}</span>
            </div>
          )}

          {driveError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{driveError}</span>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDriveFiles()}
                placeholder="Search files in your Google Drive..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchDriveFiles()}
                disabled={isLoadingDrive || !token}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Refresh Drive files"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDrive ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!token) {
                    handleSignIn();
                    return;
                  }
                  setIsUploadModalOpen(true);
                }}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Save Note / Code to Drive</span>
              </button>
            </div>
          </div>

          {/* Files Grid / Empty State */}
          {!token ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <FolderGit2 className="w-12 h-12 text-blue-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">Google Drive Not Connected</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sign in with your Google account above to browse your Drive files and upload your coding solutions and study notes.
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="mt-2 px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Sign in with Google
              </button>
            </div>
          ) : isLoadingDrive ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
              <p className="text-xs text-slate-300">Fetching files from your Google Drive...</p>
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No files found</h3>
              <p className="text-xs text-slate-400">
                {driveSearch ? `No Google Drive files matched "${driveSearch}"` : 'Your Google Drive is ready. Upload study notes or code files using the button above.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {driveFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 group shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        {file.mimeType.includes('code') || file.name.endsWith('.js') || file.name.endsWith('.py') ? (
                          <FileCode className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive File'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFileToDelete(file)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete file (requires confirmation)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 text-[10px]">
                      {file.mimeType.split('.').pop()?.toUpperCase() || 'Document'}
                    </span>

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Open in Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GMAIL STUDIO                                      */}
      {/* ======================================================== */}
      {activeTab === 'gmail' && (
        <div className="space-y-4">
          {gmailSuccessToast && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{gmailSuccessToast}</span>
            </div>
          )}

          {gmailError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{gmailError}</span>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchGmailMessages()}
                placeholder="Search messages in your Gmail inbox..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchGmailMessages()}
                disabled={isLoadingGmail || !token}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Refresh Gmail inbox"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingGmail ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!token) {
                    handleSignIn();
                    return;
                  }
                  setIsComposeModalOpen(true);
                }}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Progress Email</span>
              </button>
            </div>
          </div>

          {/* Email List / Empty State */}
          {!token ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <Mail className="w-12 h-12 text-red-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">Gmail Not Connected</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sign in with your Google account above to view your Gmail messages and send study updates directly.
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="mt-2 px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Sign in with Google
              </button>
            </div>
          ) : isLoadingGmail ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <RefreshCw className="w-8 h-8 text-red-400 mx-auto animate-spin" />
              <p className="text-xs text-slate-300">Fetching messages from your Gmail...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <Mail className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No messages found</h3>
              <p className="text-xs text-slate-400">
                {emailSearch ? `No messages matched "${emailSearch}"` : 'Your Gmail inbox is accessible. Send an email update using the button above.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {emails.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                        {msg.from || 'Sender'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 font-semibold block truncate">
                      {msg.subject || '(No Subject)'}
                    </span>
                    <p className="text-[11px] text-slate-400 truncate">
                      {msg.snippet || 'No message preview'}
                    </p>
                  </div>

                  <a
                    href={`https://mail.google.com/mail/u/0/#inbox/${msg.threadId || msg.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors shrink-0 self-end sm:self-center"
                  >
                    <span>View in Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* DRIVE UPLOAD MODAL (With explicit user confirmation)     */}
      {/* ======================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Save File to Google Drive</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">File Name</label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Content</label>
                <textarea
                  rows={6}
                  value={uploadFileContent}
                  onChange={(e) => setUploadFileContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading...' : 'Confirm Upload to Drive'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRIVE DELETE CONFIRMATION (MANDATORY per skill guidelines) */}
      {/* ======================================================== */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete File Confirmation</h3>
                <span className="text-[11px] text-slate-400">Google Drive Destructive Action</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{fileToDelete.name}"</strong> from your Google Drive? This operation cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GMAIL COMPOSE & SEND MODAL (With mandatory confirmation) */}
      {/* ======================================================== */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Send Email via Gmail</h3>
              </div>
              <button
                onClick={() => {
                  setIsComposeModalOpen(false);
                  setShowSendConfirmation(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Recipient Email *</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. mentor@gmail.com, student@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Message Body</label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Step 2: Explicit Confirmation Dialog */}
            {showSendConfirmation ? (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-2 animate-fadeIn">
                <span className="text-xs font-bold text-amber-300 block">
                  ⚠️ Explicit Confirmation: Send Email from your Gmail account?
                </span>
                <p className="text-[11px] text-slate-300">
                  This email will be sent on your behalf to <strong className="text-white">{recipientEmail}</strong>.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSendConfirmation(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSendEmail}
                    disabled={isSendingEmail}
                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md"
                  >
                    {isSendingEmail ? 'Sending...' : 'Yes, Send Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!recipientEmail || !recipientEmail.includes('@')) {
                      alert('Please provide a valid recipient email address');
                      return;
                    }
                    setShowSendConfirmation(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Review & Confirm Send →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
