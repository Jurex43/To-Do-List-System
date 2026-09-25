/**
 * @file src/pages/auth/LoginPage.tsx
 * @description Production login page for TodoList:
 * - "Username or Email" input with user icon
 * - "Password" input with lock icon and eye show/hide toggle
 * - Remember me checkbox with green tint & "Forgot password?" right link
 * - Primary button: "Log In ->"
 * - Divider: "or continue with"
 * - Social button: "Continue with Google"
 * - Bottom link: "Don't have an account? Register"
 */

import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { AuthUser, AuthView } from '../../types';
import { AuthInput } from '../../components/auth/AuthInput';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { FormError } from '../../components/auth/FormError';
import { getRegisteredUsers } from '../../utils/authHelpers';
import { supabaseSignIn } from '../../services/supabaseService';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateAuth: (view: AuthView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateAuth,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation error states
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  // Loading state during sign-in
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    let hasErrors = false;

    // 1. Username validation
    if (!identifier.trim()) {
      setIdentifierError('Please enter your username.');
      hasErrors = true;
    } else {
      setIdentifierError('');
    }

    // 2. Password validation
    if (!password) {
      setPasswordError('Please enter your password.');
      hasErrors = true;
    } else {
      setPasswordError('');
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      const cleanInput = identifier.trim().toLowerCase();

      // 1. Check registered users database (fast username login)
      const users = getRegisteredUsers();
      const matched = users.find(
        (u) => 
          (u.username?.toLowerCase() === cleanInput || 
           u.email?.toLowerCase() === cleanInput || 
           u.name?.toLowerCase() === cleanInput) && 
          u.password === password
      );

      if (matched) {
        setIsLoading(false);
        onLoginSuccess({
          id: `user-${matched.username}`,
          username: matched.username,
          name: matched.name || matched.username,
          email: matched.email || `${matched.username}@todolist.local`,
          plan: 'TodoList Pro',
        });
        return;
      }

      // 2. Attempt Supabase Cloud Authentication (if input is an email)
      if (cleanInput.includes('@')) {
        const { user: supabaseUser } = await supabaseSignIn(cleanInput, password);

        if (supabaseUser) {
          setIsLoading(false);
          onLoginSuccess(supabaseUser);
          return;
        }
      }

      // If neither succeeds
      setIsLoading(false);
      setFormError('Invalid username or password. Please check and try again.');
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err?.message || 'Authentication error. Please try again.');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Global Form Error Banner */}
      <FormError message={formError} variant="banner" />

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Username Input */}
        <AuthInput
          id="login-identifier"
          label="Username"
          type="text"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (identifierError) setIdentifierError('');
            if (formError) setFormError('');
          }}
          placeholder="e.g. Jurex43"
          autoComplete="username"
          autoFocus
          error={identifierError}
          icon={User}
          disabled={isLoading}
        />

        {/* Password Input */}
        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
            if (formError) setFormError('');
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={passwordError}
          disabled={isLoading}
        />

        {/* Remember Me Checkbox & Forgot Password Link */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A] cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => onNavigateAuth('forgot-password')}
            className="text-xs font-semibold text-[#16A34A] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Action Button: "Log In ->" */}
        <div className="pt-0.5">
          <AuthButton
            isLoading={isLoading}
            loadingText="Logging in..."
            type="submit"
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>Log In</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </AuthButton>
        </div>
      </form>

      {/* Bottom Switch: "Don't have an account? Register" */}
      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={() => onNavigateAuth('register')}
          className="font-bold text-[#16A34A] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer"
        >
          Register
        </button>
      </div>
    </div>
  );
};
