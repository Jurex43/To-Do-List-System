/**
 * @file src/services/supabaseService.ts
 * @description Cloud persistence, Auth integrations, and Task synchronization service
 * powered by your connected Supabase instance (ojflxeuxfsvmvqiljxve.supabase.co).
 * 
 * Features:
 * 1. Supabase Native Auth (Sign Up, Sign In, Sign Out, Password Reset, OAuth Google)
 * 2. Supabase Database Sync for Tasks (with fallback to LocalStorage if table is pending)
 * 3. Real-time Connection Health Check
 */

import { supabase, supabaseAdmin, SUPABASE_URL } from '../lib/supabase';
import { Task, AuthUser } from '../types';

export interface SupabaseHealthStatus {
  connected: boolean;
  projectUrl: string;
  authOperational: boolean;
  hasTasksTable: boolean;
  error?: string;
}

/**
 * Validates connection to the Supabase project
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealthStatus> {
  try {
    // 1. Check Auth service responsiveness
    const { error: authError } = await supabase.auth.getSession();
    const authOperational = !authError;

    // 2. Check if 'tasks' table exists in the database
    let hasTasksTable = false;
    try {
      const { error: tableError } = await supabase.from('tasks').select('id').limit(1);
      if (!tableError) {
        hasTasksTable = true;
      }
    } catch {
      hasTasksTable = false;
    }

    return {
      connected: true,
      projectUrl: SUPABASE_URL,
      authOperational,
      hasTasksTable,
    };
  } catch (err: any) {
    return {
      connected: false,
      projectUrl: SUPABASE_URL,
      authOperational: false,
      hasTasksTable: false,
      error: err?.message || 'Connection failed',
    };
  }
}

/**
 * Signs in a user using Supabase Authentication
 */
export async function supabaseSignIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'User record not returned from Supabase.' };
    }

    const authUser: AuthUser = {
      id: data.user.id,
      name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || email,
      plan: 'Supabase Cloud Plan',
    };

    return { user: authUser, error: null };
  } catch (err: any) {
    return { user: null, error: err?.message || 'An unexpected authentication error occurred.' };
  }
}

/**
 * Registers a new user using Supabase Authentication
 */
export async function supabaseSignUp(
  name: string,
  email: string,
  password: string
): Promise<{ user: AuthUser | null; needsEmailConfirm: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    if (error) {
      return { user: null, needsEmailConfirm: false, error: error.message };
    }

    if (!data.user) {
      return { user: null, needsEmailConfirm: false, error: 'User record not returned from Supabase.' };
    }

    // Check if Supabase requires email confirmation
    const needsEmailConfirm = !data.session;

    const authUser: AuthUser = {
      id: data.user.id,
      name: name.trim(),
      email: data.user.email || email,
      plan: 'Supabase Cloud Plan',
    };

    return { user: authUser, needsEmailConfirm, error: null };
  } catch (err: any) {
    return { user: null, needsEmailConfirm: false, error: err?.message || 'Sign up failed.' };
  }
}

/**
 * Signs out the active user session from Supabase
 */
export async function supabaseSignOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase sign out error:', err);
  }
}

/**
 * Sends a password reset email via Supabase Auth
 */
export async function supabaseResetPasswordForEmail(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Could not send reset email.' };
  }
}

/**
 * Updates the user's password via Supabase Auth
 */
export async function supabaseUpdatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Could not update password.' };
  }
}

/**
 * Initiates Google OAuth sign in via Supabase
 */
export async function supabaseSignInWithGoogle(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err?.message || 'Failed to start Google sign in.' };
  }
}

/**
 * Fetches tasks from Supabase if table exists
 */
export async function fetchTasksFromSupabase(userId: string): Promise<{ tasks: Task[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { tasks: null, error: error.message };
    }

    if (!data) return { tasks: [], error: null };

    // Map database columns to application Task model
    const tasks: Task[] = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      completed: Boolean(row.completed),
      priority: row.priority || 'medium',
      category: row.category || 'other',
      dueDate: row.due_date || '',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    }));

    return { tasks, error: null };
  } catch (err: any) {
    return { tasks: null, error: err?.message || 'Failed to query Supabase tasks.' };
  }
}

/**
 * Saves or updates a task in Supabase
 */
export async function saveTaskToSupabase(task: Task, userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload = {
      id: task.id,
      user_id: userId,
      title: task.title,
      description: task.description || null,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      due_date: task.dueDate || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('tasks')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save task to Supabase.' };
  }
}

/**
 * Deletes a task from Supabase
 */
export async function deleteTaskFromSupabase(taskId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete task from Supabase.' };
  }
}
