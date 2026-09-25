/**
 * @file src/components/auth/AuthLayout.tsx
 * @description Premium SaaS Landing Page & Split-Screen Authentication Layout for TodoList.
 * Matches the user-provided reference design pixel-for-pixel:
 * - Left Side: Branding, Tagline "Plan • Focus • Achieve", Headline with highlighted "daily tasks.",
 *   3 feature cards ("Easy to Use", "Boost Productivity", "Secure & Reliable"), realistic workspace
 *   scene with laptop previewing TodoList and motivational quote at bottom.
 * - Right Side: Clean white glassmorphism card, rounded corners (16-24px), soft shadows,
 *   TodoList logo, "Welcome back!" heading, and theme switcher.
 */

import React from 'react';
import { 
  Check, 
  Sun, 
  Moon, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { TodoListLogo } from './TodoListLogo';
import { LandingMockupDesk } from './LandingMockupDesk';

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subtitle: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heading,
  subtitle,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#F8FAF8] dark:bg-[#0B1310] text-[#0F172A] dark:text-[#F1F5F9] transition-colors relative overflow-hidden font-sans">
      
      {/* Subtle background ambient nature organic curves */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-100/40 via-emerald-50/20 to-transparent dark:from-emerald-950/20 dark:via-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-100/30 via-emerald-50/10 to-transparent dark:from-emerald-950/15 dark:via-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* LEFT SIDE: BRANDING, MARKETING & REALISTIC WORKSPACE SECTION (Full Height) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[56%] xl:w-[58%] h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 border-b lg:border-b-0 lg:border-r border-emerald-100/70 dark:border-emerald-950/60 relative z-10 overflow-y-auto lg:overflow-hidden">
        
        {/* Top Branding Section */}
        <div className="flex flex-col">
          <div className="shrink-0">
            <TodoListLogo size="md" showTagline={true} taglineText="Plan • Focus • Achieve" />
          </div>

          {/* Hero Headline Section */}
          <div className="mt-4 sm:mt-5 max-w-xl shrink-0">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[1.15]">
              A simple way to manage your{' '}
              <span className="text-[#16A34A] dark:text-[#22C55E] font-black underline decoration-emerald-300/40 dark:decoration-emerald-500/30 decoration-wavy decoration-2">
                daily tasks.
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-normal leading-relaxed">
              Stay organized, be more productive, and turn your goals into real progress — one task at a time.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4 max-w-xl shrink-0">
            
            {/* Feature 1: Easy to Use */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-emerald-100/80 dark:border-emerald-950/80 shadow-[0_4px_16px_-4px_rgba(22,163,74,0.05)] hover:shadow-md transition-all">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center text-[#16A34A] dark:text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <h3 className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                Easy to Use
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Simple and clean interface for everyone.
              </p>
            </div>

            {/* Feature 2: Boost Productivity */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-emerald-100/80 dark:border-emerald-950/80 shadow-[0_4px_16px_-4px_rgba(22,163,74,0.05)] hover:shadow-md transition-all">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center text-[#16A34A] dark:text-emerald-400">
                <Zap className="w-3.5 h-3.5 fill-emerald-500/20" />
              </div>
              <h3 className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                Boost Productivity
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Keep track, stay focused, get more done.
              </p>
            </div>

            {/* Feature 3: Secure & Reliable */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-emerald-100/80 dark:border-emerald-950/80 shadow-[0_4px_16px_-4px_rgba(22,163,74,0.05)] hover:shadow-md transition-all">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center text-[#16A34A] dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                Secure & Reliable
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Your data is safe and always with you.
              </p>
            </div>

          </div>

          {/* Realistic Workspace Scene: Open Laptop with TodoList Dashboard, Desk & Notebook */}
          <div className="mt-4 w-full max-w-xl min-h-0 flex-1">
            <LandingMockupDesk />
          </div>
        </div>

        {/* Motivational Quote at Bottom */}
        <div className="pt-2 sm:pt-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 rounded-full bg-[#16A34A]" />
            <p className="text-[11px] sm:text-xs font-medium italic text-slate-500 dark:text-slate-400">
              &ldquo;Discipline today builds the freedom you want tomorrow.&rdquo;
            </p>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: PREMIUM AUTHENTICATION CARD SECTION                           */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[44%] xl:w-[42%] h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 relative z-10 bg-slate-50/50 dark:bg-slate-950/30 overflow-y-auto lg:overflow-hidden">
        
        {/* Top Header bar with Theme switch */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto shrink-0">
          {/* Mobile-only logo */}
          <div className="lg:hidden">
            <TodoListLogo size="sm" />
          </div>

          <div className="hidden lg:block">
            {/* Desktop spacer */}
          </div>

          {/* Theme switcher toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        {/* White Glassmorphism Card Container (Center Aligned, 16-24px rounded corners) */}
        <div className="w-full max-w-[440px] mx-auto my-auto py-2">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-5 sm:p-7 md:p-8 rounded-[22px] border border-emerald-100/80 dark:border-emerald-950/80 shadow-[0_16px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all">
            
            {/* Top Section inside Card */}
            <div className="text-center mb-4 sm:mb-5">
              <div className="flex justify-center mb-2 sm:mb-2.5">
                <TodoListLogo size="md" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
                {heading || 'Welcome back!'}
              </h2>
              <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                {subtitle || 'Log in to your account and keep your plans on track.'}
              </p>
            </div>

            {/* Form body */}
            {children}

          </div>

          {/* Footer branding text */}
          <div className="text-center pt-3 sm:pt-4 text-[11px] font-medium text-[#64748B] dark:text-slate-400">
            <span>TodoList • Organize Today, Achieve Tomorrow</span>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="hidden lg:block h-1 shrink-0" />

      </div>

    </div>
  );
};
