/**
 * @file src/components/auth/AuthButton.tsx
 * @description Primary action button for authentication with rich green palette (#16A34A) and rounded styling.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  disabled = false,
  type = 'submit',
  variant = 'primary',
  onClick,
  className = '',
}) => {
  const baseStyles = 'w-full py-3.5 px-5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]';

  const variants = {
    primary: 'bg-[#16A34A] hover:bg-[#15803D] active:bg-[#166534] text-white shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] disabled:bg-emerald-400 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed',
    secondary: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-[#16A34A] dark:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{loadingText || 'Please wait...'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
