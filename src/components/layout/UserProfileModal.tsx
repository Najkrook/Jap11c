import React from 'react';
import { useAuth } from '../../context/authState';
import { useProgression } from '../../context/progressionState';
import { useAudio } from '../../modules/audio';
import { Cloud, CloudOff, RefreshCw, LogOut, X, User as UserIcon, ShieldCheck, Flame, Zap, Trophy } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, signOutUser, isSyncing, lastSyncedAt, syncError } = useAuth();
  const { stats, summary, syncNow } = useProgression();
  const { playSfx } = useAudio();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    playSfx('click');
    await signOutUser();
    onClose();
  };

  const handleSyncNow = async () => {
    playSfx('click');
    await syncNow();
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Ej synkad ännu';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 dark:bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="bg-white dark:bg-sumi-900 rounded-2xl shadow-xl border border-paper-300 dark:border-sumi-700 w-full max-w-md overflow-hidden text-ink-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-paper-100/80 dark:bg-sumi-800/80 border-b border-paper-200 dark:border-sumi-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h3 id="profile-modal-title" className="font-bold text-sm tracking-tight">Konto & Molnsynk</h3>
          </div>
          <button 
            onClick={onClose}
            aria-label="Stäng konto och molnsynk"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-paper-200 dark:hover:bg-sumi-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-paper-50 dark:bg-sumi-800/50 border border-paper-200 dark:border-sumi-700">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Profil'} 
                className="w-14 h-14 rounded-full border-2 border-amber-400/40 object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 flex items-center justify-center font-bold text-xl">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={24} />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-bold text-base text-ink-900 dark:text-white truncate">
                {user?.displayName || 'Inloggad användare'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'Google-konto'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Molnlagring aktiv</span>
              </div>
            </div>
          </div>

          {/* Quick Stats overview */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-paper-100/70 dark:bg-sumi-800/70 border border-paper-200 dark:border-sumi-700/80">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Zap size={15} />
              </div>
              <div className="font-extrabold text-sm text-ink-900 dark:text-white">{stats.xp}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Total XP</div>
            </div>
            <div className="p-3 rounded-xl bg-paper-100/70 dark:bg-sumi-800/70 border border-paper-200 dark:border-sumi-700/80">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Flame size={15} />
              </div>
              <div className="font-extrabold text-sm text-ink-900 dark:text-white">{stats.streakDays}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Dagar Streak</div>
            </div>
            <div className="p-3 rounded-xl bg-paper-100/70 dark:bg-sumi-800/70 border border-paper-200 dark:border-sumi-700/80">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Trophy size={15} />
              </div>
              <div className="font-extrabold text-sm text-ink-900 dark:text-white">{summary.totalMasteredKana}/71</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Mästrade</div>
            </div>
          </div>

          {/* Cloud Sync Status info */}
          <div className="p-3.5 rounded-xl bg-paper-100/50 dark:bg-sumi-800/40 border border-paper-200 dark:border-sumi-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              {isSyncing ? (
                <RefreshCw size={16} className="text-amber-500 animate-spin" />
              ) : syncError ? (
                <CloudOff size={16} className="text-rose-500" />
              ) : (
                <Cloud size={16} className="text-emerald-500" />
              )}
              <div>
                <div className="font-semibold text-ink-900 dark:text-white">
                  {isSyncing ? 'Synkar till Firestore...' : syncError ? 'Synkroniseringsfel' : 'Synkroniserad'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Senast sparad: {formatLastSync(lastSyncedAt)}
                </div>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-sumi-700 border border-paper-300 dark:border-sumi-600 text-ink-800 dark:text-slate-200 hover:bg-paper-100 dark:hover:bg-sumi-600 shadow-2xs transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
              <span>Synka nu</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-paper-100/50 dark:bg-sumi-800/50 border-t border-paper-200 dark:border-sumi-700/60 flex justify-end gap-3">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logga ut</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 hover:opacity-90 shadow-2xs transition-opacity cursor-pointer"
          >
            Klar
          </button>
        </div>
      </div>
    </div>
  );
};
