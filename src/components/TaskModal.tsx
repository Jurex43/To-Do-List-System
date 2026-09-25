/**
 * @file src/components/TaskModal.tsx
 * @description Modal dialog for creating new tasks or editing existing tasks.
 * Includes validation for required fields, clean input controls, and keyboard escape handling.
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { Task, PriorityLevel, TaskCategory } from '../types';
import { getTodayDateString } from '../utils/taskHelpers';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const isEditing = Boolean(taskToEdit);

  // Form input state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [errorMessage, setErrorMessage] = useState('');

  // Whenever taskToEdit changes or modal opens, reset form inputs
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || getTodayDateString());
    } else {
      setTitle('');
      setDescription('');
      setCategory('work');
      setPriority('medium');
      setDueDate(getTodayDateString());
    }
    setErrorMessage('');
  }, [taskToEdit, isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation check: Title is required
    if (!title.trim()) {
      setErrorMessage('Please enter a task title to continue.');
      return;
    }

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate,
      completed: taskToEdit ? taskToEdit.completed : false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 id="modal-title" className="text-lg font-bold text-neutral-900 dark:text-white">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Task Title Input */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g., Review project documentation"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description <span className="text-neutral-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, links, or notes..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label htmlFor="task-category" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Category
              </label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="personal">Personal</option>
                <option value="school">School</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label htmlFor="task-priority" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date Picker */}
          <div>
            <label htmlFor="task-due-date" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-indigo-500 focus:outline-none transition-colors font-mono"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] active:bg-[#166534] rounded-xl shadow-[0_2px_8px_rgba(22,163,74,0.25)] transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
