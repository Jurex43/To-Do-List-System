/**
 * @file src/utils/authHelpers.ts
 * @description Production authentication utilities, client-side validation logic, and
 * session management for the TodoList platform. All demo user credentials removed.
 */

import { AuthUser } from '../types';

export const AUTH_STORAGE_KEY = 'todolist_is_authenticated';
export const USER_STORAGE_KEY = 'todolist_auth_user';
export const USERS_DB_KEY = 'todolist_registered_users';

/**
 * Validates email format using standard regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Evaluates password strength criteria:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one numerical digit
 */
export function checkPasswordStrength(password: string) {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isValid = hasMinLength && hasUpper && hasLower && hasNumber;

  return {
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    isValid,
  };
}

/**
 * Retrieves the currently logged in user session from LocalStorage
 */
export function getStoredAuthSession(): { isAuthenticated: boolean; user: AuthUser | null } {
  try {
    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (isAuth && userJson) {
      const user = JSON.parse(userJson) as AuthUser;
      return { isAuthenticated: true, user };
    }
  } catch (err) {
    console.warn('Failed to read auth state from LocalStorage:', err);
  }
  return { isAuthenticated: false, user: null };
}

/**
 * Stores authentication credentials in LocalStorage
 */
export function saveAuthSession(user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save auth state to LocalStorage:', err);
  }
}

/**
 * Clears current session from LocalStorage on Logout
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear auth state from LocalStorage:', err);
  }
}

export interface RegisteredUser {
  username: string;
  name: string;
  email?: string;
  password: string;
  createdAt: string;
}

/**
 * Validates username: 3-20 chars, letters, numbers, underscores, dashes, dots
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,20}$/;
  return usernameRegex.test(username.trim());
}

/**
 * Retrieves registered users list so newly created accounts can sign in
 */
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse users database:', err);
  }
  return [];
}

/**
 * Saves a newly registered user to LocalStorage
 */
export function saveNewUser(newUser: { username: string; name?: string; email?: string; password: string }): void {
  const users = getRegisteredUsers();
  const rawUsername = newUser.username.trim();
  const normalized = rawUsername.toLowerCase();
  
  // Filter out any existing with same username (case-insensitive)
  const filtered = users.filter((u) => u.username.toLowerCase() !== normalized);
  filtered.push({
    username: rawUsername,
    name: newUser.name?.trim() || rawUsername,
    email: newUser.email?.trim() || `${normalized}@todolist.app`,
    password: newUser.password,
    createdAt: new Date().toISOString(),
  });
  
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save user in LocalStorage:', err);
  }
}

/**
 * Checks if a username is already taken
 */
export function isUsernameTaken(username: string): boolean {
  const users = getRegisteredUsers();
  const cleanUsername = username.trim().toLowerCase();
  return users.some((u) => u.username.toLowerCase() === cleanUsername);
}
