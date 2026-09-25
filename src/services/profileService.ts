/**
 * @file src/services/profileService.ts
 * @description Profile persistence and sync operations across LocalStorage and Supabase.
 */

import { supabase } from '../lib/supabase';
import { AuthUser } from '../types';
import { getRegisteredUsers, USERS_DB_KEY, saveAuthSession } from '../utils/authHelpers';

export async function updateUserProfile(
  oldUser: AuthUser,
  updatedUser: AuthUser
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Update in LocalStorage registered users database
    const users = getRegisteredUsers();
    const oldUsername = (oldUser.username || '').toLowerCase();
    const newUsername = (updatedUser.username || '').toLowerCase();

    const updatedList = users.map((u) => {
      const match = (u.username && u.username.toLowerCase() === oldUsername) || 
                    (u.email && u.email.toLowerCase() === oldUser.email.toLowerCase()) ||
                    (u.name && u.name === oldUser.name);
      if (match) {
        return {
          ...u,
          username: updatedUser.username || u.username,
          name: updatedUser.name,
          email: updatedUser.email,
        };
      }
      return u;
    });

    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedList));

    // If username changed, also migrate tasks to the new username storage key
    if (oldUsername && newUsername && oldUsername !== newUsername) {
      try {
        const oldKey = `todolist_tasks_v2_user_${oldUsername.replace(/[^a-z0-9_-]/g, '_')}`;
        const newKey = `todolist_tasks_v2_user_${newUsername.replace(/[^a-z0-9_-]/g, '_')}`;
        const existingTasks = localStorage.getItem(oldKey);
        if (existingTasks) {
          localStorage.setItem(newKey, existingTasks);
        }
      } catch (err) {
        console.warn('Could not migrate user tasks on username change:', err);
      }
    }

    // 2. Update active session
    saveAuthSession(updatedUser);

    // 3. Try to sync to Supabase if connected
    try {
      if (updatedUser.id && !updatedUser.id.startsWith('user-')) {
        const { error: sbError } = await supabase
          .from('profiles')
          .update({
            full_name: updatedUser.name,
            username: updatedUser.username || null,
            avatar_url: updatedUser.avatar || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', updatedUser.id);

        if (sbError) {
          console.warn('Supabase profile sync warning:', sbError.message);
        }
      }
    } catch (e) {
      console.warn('Supabase profile update skipped/failed:', e);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Could not update profile' };
  }
}
