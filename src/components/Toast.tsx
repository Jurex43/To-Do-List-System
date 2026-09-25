/**
 * @file src/components/Toast.tsx
 * @description Toast notification feedback component for user actions.
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-500 shrink-0" />,
  };

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-neutral-900 dark:bg-neutral-800 text-white rounded-xl shadow-lg border border-neutral-700/50 max-w-sm animate-in slide-in-from-bottom-5 duration-200"
    >
      {icons[toast.type]}
      <p className="text-sm font-medium pr-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="p-1 text-neutral-400 hover:text-white rounded-md transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
