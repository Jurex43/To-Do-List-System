/**
 * @file src/components/EditProfileModal.tsx
 * @description Modal dialog allowing the user to customize and change their profile:
 * - Full Name / Display Name
 * - Username (e.g. Jurex43)
 * - Email address
 * - Avatar selection / custom URL
 * - Updates local storage session & syncs with Supabase profiles table
 */

import React, { useState, useEffect } from 'react';
import { X, User, AtSign, Mail, Image, Check, Sparkles } from 'lucide-react';
import { AuthUser } from '../types';
import { isValidUsername, isUsernameTaken } from '../utils/authHelpers';
import avatarImg1 from '../assets/images/avatar_user_profile_1790326096968.jpg';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUpdateProfile: (updatedUser: AuthUser) => Promise<{ success: boolean; error?: string }>;
}

const PRESET_AVATARS = [
  { id: 'default', label: 'Default', url: avatarImg1 },
  { id: 'man1', label: 'Alex', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'man2', label: 'Jordan', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'woman1', label: 'Elena', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'tech', label: 'Dev', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || avatarImg1);
      setCustomAvatarUrl(currentUser.avatar && !PRESET_AVATARS.some(p => p.url === currentUser.avatar) ? currentUser.avatar : '');
      setError('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanUsername = username.trim();

    if (!cleanName) {
      setError('Please provide a display name.');
      return;
    }

    if (cleanUsername) {
      if (!isValidUsername(cleanUsername)) {
        setError('Username must be 3-20 characters long (letters, numbers, underscores).');
        return;
      }

      // If username changed, check if taken
      if (cleanUsername.toLowerCase() !== (currentUser.username || '').toLowerCase() && isUsernameTaken(cleanUsername)) {
        setError('This username is already in use. Please select another.');
        return;
      }
    }

    setIsSaving(true);

    const chosenAvatar = customAvatarUrl.trim() || avatar || avatarImg1;

    const updatedUser: AuthUser = {
      ...currentUser,
      name: cleanName,
      username: cleanUsername || undefined,
      email: email.trim() || currentUser.email,
      avatar: chosenAvatar,
    };

    const result = await onUpdateProfile(updatedUser);
    setIsSaving(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to update profile. Please try again.');
    }
  };

  const currentActiveAvatar = customAvatarUrl.trim() || avatar || avatarImg1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Edit Profile</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Change your display info and avatar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              {error}
            </div>
          )}

          {/* Avatar Preview & Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Profile Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#16A34A] bg-neutral-100 dark:bg-neutral-800 shrink-0">
                <img
                  src={currentActiveAvatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = avatarImg1;
                  }}
                />
              </div>

              {/* Preset choices */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setAvatar(p.url);
                        setCustomAvatarUrl('');
                      }}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === p.url && !customAvatarUrl
                          ? 'border-[#16A34A] ring-2 ring-emerald-500/30 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400">Select an avatar or paste a custom image URL below</p>
              </div>
            </div>

            {/* Custom Image URL */}
            <div className="pt-1">
              <div className="relative flex items-center">
                <Image className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="Custom avatar image URL (optional)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Display Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jurex Badiao"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Username
            </label>
            <div className="relative flex items-center">
              <AtSign className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                placeholder="e.g. Jurex43"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
            <p className="text-[11px] text-neutral-400">Used for fast login and your profile handle (@username)</p>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jurexbadiao43@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
