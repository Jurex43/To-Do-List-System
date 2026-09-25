/**
 * @file src/pages/auth/ForgotPasswordPage.tsx
 * @description Forgot password request view. Takes user's email, validates format,
 * displays feedback, and guides user to password reset.
 */

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthView } from '../../types';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { isValidEmail } from '../../utils/authHelpers';
import { supabaseResetPasswordForEmail } from '../../services/supabaseService';

interface ForgotPasswordPageProps {
  onNavigateAuth: (view: AuthView) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateAuth,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setIsLoading(true);

    try {
      await supabaseResetPasswordForEmail(email);
      setIsLoading(false);
      setIsSent(true);
    } catch {
      setIsLoading(false);
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4 py-2 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Reset Link Sent!
          </h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            We sent a password reset link to <strong className="text-neutral-800 dark:text-neutral-200">{email}</strong>.
          </p>
        </div>

        <div className="pt-2 space-y-2">
          {/* Quick link to test Reset Password view in demo */}
          <AuthButton
            variant="primary"
            onClick={() => onNavigateAuth('reset-password')}
          >
            Proceed to Reset Password
          </AuthButton>

          <button
            type="button"
            onClick={() => onNavigateAuth('login')}
            className="w-full py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="forgot-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder="name@example.com"
          autoComplete="email"
          autoFocus
          error={emailError}
          icon={Mail}
          disabled={isLoading}
        />

        <AuthButton
          isLoading={isLoading}
          loadingText="Sending reset link..."
          type="submit"
        >
          Send Reset Link
        </AuthButton>
      </form>

      {/* Back to Login link */}
      <div className="pt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <span>Remember your password? </span>
        <button
          type="button"
          onClick={() => onNavigateAuth('login')}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};
