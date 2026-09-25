/**
 * @file src/pages/SettingsView.tsx
 * @description Settings and preferences view. Provides profile management,
 * theme customization, and app information.
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Task, AuthUser } from '../types';
import { EditProfileModal } from '../components/EditProfileModal';
import avatarImg from '../assets/images/avatar_user_profile_1790326096968.jpg';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  tasks?: Task[];
  onClearAllTasks?: () => void;
  onImportTasks?: (importedTasks: Task[]) => void;
  currentUser: AuthUser | null;
  onUpdateProfile: (user: AuthUser) => Promise<{ success: boolean; error?: string }>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onToggleTheme,
  currentUser,
  onUpdateProfile,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div className="max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#2563EB] dark:text-blue-400" />
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
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
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
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {currentUser?.plan || 'Tasks Pro'}
                </span>
              </div>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span>Edit Profile Details</span>
          </button>
        </div>
      </div>

      {/* 2. Theme Configuration */}
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
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
              !isDarkMode
                ? 'border-[#2563EB] bg-blue-50/50 dark:bg-blue-950/40 text-neutral-900 font-semibold shadow-xs'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-neutral-800 flex items-center justify-center text-amber-500">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm">Light Mode</div>
              <div className="text-[11px] text-neutral-500 font-normal">Crisp white & neutral slate</div>
            </div>
          </button>

          {/* Dark Mode Selector */}
          <button
            type="button"
            onClick={() => {
              if (!isDarkMode) onToggleTheme();
            }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'border-[#2563EB] bg-blue-50/50 dark:bg-blue-950/40 text-white font-semibold shadow-xs'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-950/50 flex items-center justify-center text-blue-400">
              <Moon className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm">Dark Mode</div>
              <div className="text-[11px] text-neutral-400 font-normal">Deep slate & obsidian</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. About Tasks */}
      <div className="p-6 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-blue-950/20 dark:via-neutral-900 dark:to-neutral-900 border border-blue-100 dark:border-blue-950 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>About Tasks</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </h3>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
              &ldquo;Plan • Focus • Achieve&rdquo;
            </p>
            <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1.5">
              <p>• Smart task organization with priorities, categories, and deadlines.</p>
              <p>• Daily velocity tracking and habit momentum.</p>
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
