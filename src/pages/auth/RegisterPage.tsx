/**
 * @file src/pages/auth/RegisterPage.tsx
 * @description Instant registration page view using Username and Password.
 * No email confirmation/verification required — user registers and is logged straight into the app!
 */

import React, { useState } from 'react';
import { User, AtSign, CheckCircle2 } from 'lucide-react';
import { AuthUser, AuthView } from '../../types';
import { AuthInput } from '../../components/auth/AuthInput';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { AuthButton } from '../../components/auth/AuthButton';
import { FormError } from '../../components/auth/FormError';
import { 
  isValidUsername,
  isUsernameTaken,
  checkPasswordStrength, 
  saveNewUser 
} from '../../utils/authHelpers';

interface RegisterPageProps {
  onRegisterSuccess: (user: AuthUser) => void;
  onNavigateAuth: (view: AuthView) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateAuth,
}) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Field validation error states
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [formError, setFormError] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    let hasErrors = false;

    // 1. Username validation
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setUsernameError('Please choose a username.');
      hasErrors = true;
    } else if (!isValidUsername(cleanUsername)) {
      setUsernameError('Username must be 3-20 characters (letters, numbers, underscores).');
      hasErrors = true;
    } else if (isUsernameTaken(cleanUsername)) {
      setUsernameError('This username is already taken. Please pick another.');
      hasErrors = true;
    } else {
      setUsernameError('');
    }

    // 2. Password strength validation
    const strength = checkPasswordStrength(password);
    if (!password) {
      setPasswordError('Please enter a password.');
      hasErrors = true;
    } else if (!strength.isValid) {
      setPasswordError('Password does not meet the minimum strength requirements.');
      hasErrors = true;
    } else {
      setPasswordError('');
    }

    // 3. Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasErrors = true;
    } else {
      setConfirmPasswordError('');
    }

    // 4. Terms agreement validation
    if (!agreeTerms) {
      setTermsError('Please accept the Terms to create an account.');
      hasErrors = true;
    } else {
      setTermsError('');
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      // Direct registration without email verification
      const displayName = name.trim() || cleanUsername;
      
      saveNewUser({
        username: cleanUsername,
        name: displayName,
        email: `${cleanUsername}@todolist.local`,
        password,
      });

      const registeredUser: AuthUser = {
        id: `user-${cleanUsername}`,
        username: cleanUsername,
        name: displayName,
        email: `${cleanUsername}@todolist.local`,
        plan: 'TodoList Pro',
      };

      setIsLoading(false);
      onRegisterSuccess(registeredUser);
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err?.message || 'Could not complete registration. Please try again.');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Global Form Error Banner */}
      <FormError message={formError} variant="banner" />

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Username */}
        <AuthInput
          id="register-username"
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value.replace(/\s+/g, ''));
            if (usernameError) setUsernameError('');
          }}
          placeholder="e.g. Jurex43"
          autoComplete="username"
          autoFocus
          error={usernameError}
          icon={AtSign}
          disabled={isLoading}
        />

        {/* Display Name (Optional) */}
        <AuthInput
          id="register-name"
          label="Display Name (Optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jurex Badiao"
          autoComplete="name"
          icon={User}
          disabled={isLoading}
        />

        {/* Password */}
        <PasswordInput
          id="register-password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          autoComplete="new-password"
          error={passwordError}
          disabled={isLoading}
        />

        {/* Live Password Strength Requirements Indicator */}
        <PasswordStrength password={password} />

        {/* Confirm Password */}
        <PasswordInput
          id="register-confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          autoComplete="new-password"
          error={confirmPasswordError}
          disabled={isLoading}
        />

        {/* Terms of Service Checkbox */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (termsError) setTermsError('');
              }}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB] cursor-pointer shrink-0"
            />
            <span className="leading-snug">
              I agree to the Terms of Service & Privacy Policy
            </span>
          </label>
          <FormError message={termsError} />
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <AuthButton
            isLoading={isLoading}
            loadingText="Creating account..."
            type="submit"
          >
            Create Account & Enter
          </AuthButton>
        </div>
      </form>

      {/* Bottom Switch to Login */}
      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={() => onNavigateAuth('login')}
          className="font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
