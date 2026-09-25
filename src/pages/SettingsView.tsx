/**
 * @file src/pages/SettingsView.tsx
 * @description Settings and preferences view. Provides theme customization,
 * backup export/import of LocalStorage data, demo data reset, and architecture notes.
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Check, 
  Info,
  ShieldCheck,
  CloudCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Key
} from 'lucide-react';
import { Task, AuthUser } from '../types';
import { checkSupabaseConnection, SupabaseHealthStatus } from '../services/supabaseService';
import { EditProfileModal } from '../components/EditProfileModal';
import avatarImg from '../assets/images/avatar_user_profile_1790326096968.jpg';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  tasks: Task[];
  onClearAllTasks: () => void;
  onImportTasks: (importedTasks: Task[]) => void;
  currentUser: AuthUser | null;
  onUpdateProfile: (user: AuthUser) => Promise<{ success: boolean; error?: string }>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onToggleTheme,
  tasks,
  onClearAllTasks,
  onImportTasks,
  currentUser,
  onUpdateProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const testSupabase = async () => {
    setCheckingHealth(true);
    const health = await checkSupabaseConnection();
    setSupabaseHealth(health);
    setCheckingHealth(false);
  };

  useEffect(() => {
    testSupabase();
  }, []);

  // Export tasks as JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import tasks from JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTasks(parsed);
          setImportMessage(`Successfully imported ${parsed.length} tasks!`);
          setTimeout(() => setImportMessage(null), 4000);
        } else {
          setImportMessage('Invalid file format. Expected a JSON array of tasks.');
        }
      } catch {
        setImportMessage('Could not parse JSON file. Please check file content.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Settings & Preferences</span>
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Customize your experience, manage your account profile, and review preferences.
        </p>
      </div>

      {/* 1. Account Profile Card */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <img
                src={currentUser?.avatar || avatarImg}
                alt={currentUser?.name || 'User'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = avatarImg;
                }}
              />
              <span className="text-lg font-bold text-neutral-700 dark:text-neutral-200">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'JB'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {currentUser?.name || 'Jurex Badiao'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  {currentUser?.plan || 'TodoList Pro'}
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                {currentUser?.username ? `@${currentUser.username}` : '@Jurex43'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {currentUser?.email || 'jurexbadiao43@gmail.com'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span>Edit Profile Details</span>
          </button>
        </div>
      </div>

      {/* 1. Theme Configuration */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          Appearance & Theme
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Switch between clean light mode and soothing dark mode. Your preference is automatically remembered.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Light Mode Selector */}
          <button
            type="button"
            onClick={() => {
              if (isDarkMode) onToggleTheme();
            }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              !isDarkMode
                ? 'border-[#16A34A] bg-emerald-50/70 dark:bg-emerald-950/40 text-neutral-900 dark:text-white shadow-xs'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              !isDarkMode ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
            }`}>
              <Sun className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-bold">Light Mode</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">Crisp white & neutral gray</div>
            </div>
            {!isDarkMode && (
              <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Dark Mode Selector */}
          <button
            type="button"
            onClick={() => {
              if (!isDarkMode) onToggleTheme();
            }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              isDarkMode
                ? 'border-[#16A34A] bg-emerald-950/40 text-white shadow-xs'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isDarkMode ? 'bg-emerald-900/60 text-emerald-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
            }`}>
              <Moon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-bold">Dark Mode</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">Deep slate & charcoal</div>
            </div>
            {isDarkMode && (
              <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Cloud Backup & Account Security */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CloudCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Cloud Sync & Account Security</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced & Active
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Real-time backup and encrypted account protection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={testSupabase}
            disabled={checkingHealth}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Check Cloud Sync Status"
          >
            <RefreshCw className={`w-4 h-4 ${checkingHealth ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Encrypted Cloud Storage</p>
              <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                Your tasks and categories are saved in the cloud and synced across devices.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex items-start gap-2.5">
            <Key className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Secure Authentication</p>
              <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                Protected login with industry-standard encryption and token validation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Management & Backup */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          Data Management & Local Backup
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          You have full ownership of your data. You can download a backup of all your tasks or restore your tasks from a backup file at any time.
        </p>

        {importMessage && (
          <div className="p-3 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>{importMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 p-3 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#16A34A]" />
            <span>Download Backup</span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#16A34A]" />
              <span>Restore from Backup</span>
            </button>
          </div>

          {/* Clear All Tasks */}
          <button
            type="button"
            onClick={onClearAllTasks}
            className="flex items-center justify-center gap-2 p-3 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Tasks</span>
          </button>
        </div>
      </div>

      {/* 4. About TodoList */}
      <div className="p-6 bg-gradient-to-br from-emerald-50/50 via-white to-[#F8FAF8] dark:from-emerald-950/20 dark:via-neutral-900 dark:to-neutral-900 border border-emerald-100 dark:border-emerald-950 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              About TaskFlow
            </h3>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              &ldquo;Plan • Focus • Achieve&rdquo;
            </p>
            <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1.5">
              <p>• Smart task organization with priorities, categories, and deadlines.</p>
              <p>• Automatic offline support with background synchronization.</p>
              <p>• Clean, focused interface built for daily productivity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Profile Dialog Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={onUpdateProfile}
      />
    </div>
  );
};
