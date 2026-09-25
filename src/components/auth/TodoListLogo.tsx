/**
 * @file src/components/auth/TodoListLogo.tsx
 * @description Official TodoList branding logo with green rounded squircle and white checkmark icon,
 * matching the user's reference mockup pixel-for-pixel.
 */

import React from 'react';
import { Check } from 'lucide-react';

interface TodoListLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
}

export const TodoListLogo: React.FC<TodoListLogoProps> = ({ 
  size = 'md',
  showTagline = false,
  taglineText = 'Plan • Focus • Achieve',
  className = '',
}) => {
  const iconBoxSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const checkSizes = {
    sm: 'w-4 h-4 stroke-[3]',
    md: 'w-5 h-5 stroke-[3.2]',
    lg: 'w-6 h-6 stroke-[3.5]',
    xl: 'w-8 h-8 stroke-[3.5]',
  };

  const textSizes = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-extrabold',
    lg: 'text-3xl font-extrabold',
    xl: 'text-4xl font-extrabold',
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* Soft rounded green brand squircle */}
        <div className={`${iconBoxSizes[size]} bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0`}>
          <Check className={checkSizes[size]} />
        </div>
        <span className={`${textSizes[size]} tracking-tight text-slate-900 dark:text-white font-sans`}>
          TodoList
        </span>
      </div>
      {showTagline && (
        <span className="text-[12px] font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-1 pl-0.5">
          {taglineText}
        </span>
      )}
    </div>
  );
};
