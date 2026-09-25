/**
 * @file src/App.tsx
 * @description Main application component for TaskFlow.
 * Manages global task state, view navigation, local storage persistence,
 * dark mode toggling, dialog modals, and toast notifications.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Task, 
  NavigationView, 
  ToastNotification, 
  TaskCategory,
  AuthUser,
  AuthView
} from './types';
import { INITIAL_TASKS } from './data/initialTasks';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  calculateTaskStats, 
  getTodayDateString, 
  isTaskOverdue, 
  THEME_STORAGE_KEY 
} from './utils/taskHelpers';
import { 
  getStoredAuthSession, 
  saveAuthSession, 
  clearAuthSession 
} from './utils/authHelpers';
import { supabaseSignOut, 
  saveTaskToSupabase, 
  deleteTaskFromSupabase,
  fetchTasksFromSupabase 
} from './services/supabaseService';
import { updateUserProfile } from './services/profileService';
import { supabase } from './lib/supabase';

// Layout & UI Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { EditProfileModal } from './components/EditProfileModal';
import { Toast } from './components/Toast';

// Auth Pages & Layout
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Main App Views
import { DashboardView } from './pages/DashboardView';
import { TasksView } from './pages/TasksView';
import { TodayView } from './pages/TodayView';
import { UpcomingView } from './pages/UpcomingView';
import { CompletedView } from './pages/CompletedView';
import { CategoryView } from './pages/CategoryView';
import { SettingsView } from './pages/SettingsView';

export default function App() {
  // 1. Authentication State
  const [authSession, setAuthSession] = useState<{ isAuthenticated: boolean; user: AuthUser | null }>(() => 
    getStoredAuthSession()
  );
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // 2. Task State initialized from LocalStorage per active user
  const userKey = authSession.user?.username || authSession.user?.id || null;
  const [tasks, setTasks] = useState<Task[]>(() => {
    const initialSession = getStoredAuthSession();
    const initialKey = initialSession.user?.username || initialSession.user?.id || null;
    const saved = loadTasksFromStorage(initialKey);
    if (saved && Array.isArray(saved)) {
      return saved;
    }
    return [];
  });

  // 3. Navigation State
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 4. Search query state (shared between header and task views)
  const [searchQuery, setSearchQuery] = useState('');

  // 5. Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Helper function to update user profile
  const handleUpdateProfile = async (updatedUser: AuthUser): Promise<{ success: boolean; error?: string }> => {
    if (!authSession.user) return { success: false, error: 'No user session found' };
    const res = await updateUserProfile(authSession.user, updatedUser);
    if (res.success) {
      setAuthSession({ isAuthenticated: true, user: updatedUser });
      showToast('Profile updated successfully!', 'success');
    }
    return res;
  };

  // 6. Toast Notification State
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Helper function to trigger a toast
  const showToast = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({
      id: String(Date.now()),
      message,
      type,
    });
  };

  // 7. Theme State (Dark / Light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Synchronize dark mode class on document element whenever theme toggles
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'false');
      }
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }, [isDarkMode]);

  // Synchronize tasks state with LocalStorage for the current active user
  useEffect(() => {
    if (authSession.isAuthenticated && userKey) {
      saveTasksToStorage(tasks, userKey);
    }
  }, [tasks, authSession.isAuthenticated, userKey]);

  // Load account-specific tasks whenever authSession user changes
  useEffect(() => {
    if (authSession.isAuthenticated && userKey) {
      const stored = loadTasksFromStorage(userKey);
      if (stored && Array.isArray(stored)) {
        setTasks(stored);
      } else {
        setTasks([]);
      }
    } else if (!authSession.isAuthenticated) {
      setTasks([]);
    }
  }, [authSession.isAuthenticated, userKey]);

  // Synchronize with active Supabase session on mount
  useEffect(() => {
    // 1. Check active Supabase session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
          email: u.email || 'user@supabase.co',
          plan: 'Supabase Cloud Plan',
        };
        setAuthSession({ isAuthenticated: true, user: authUser });
        saveAuthSession(authUser);
      }
    });

    // 2. Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
          email: u.email || 'user@supabase.co',
          plan: 'Supabase Cloud Plan',
        };
        setAuthSession({ isAuthenticated: true, user: authUser });
        saveAuthSession(authUser);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch Supabase cloud tasks when user is authenticated
  useEffect(() => {
    if (authSession.isAuthenticated && authSession.user?.id) {
      fetchTasksFromSupabase(authSession.user.id).then(({ tasks: cloudTasks }) => {
        if (cloudTasks && cloudTasks.length > 0) {
          setTasks(cloudTasks);
        }
      });
    }
  }, [authSession.isAuthenticated, authSession.user?.id]);

  // Derived Task Statistics
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  // Compute navigation badge counts
  const taskCounts = useMemo(() => {
    const todayStr = getTodayDateString();
    const categories: Record<TaskCategory, number> = {
      personal: 0,
      school: 0,
      work: 0,
      other: 0,
    };

    let todayCount = 0;
    let upcomingCount = 0;

    for (const t of tasks) {
      if (!t.completed) {
        if (t.category in categories) {
          categories[t.category]++;
        }
        if (t.dueDate === todayStr) {
          todayCount++;
        } else if (t.dueDate > todayStr) {
          upcomingCount++;
        }
      }
    }

    return {
      total: stats.total,
      pending: stats.pending,
      today: todayCount,
      upcoming: upcomingCount,
      completed: stats.completed,
      categories,
    };
  }, [tasks, stats]);

  // Page title mapping based on active navigation view
  const pageTitle = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'tasks':
        return 'My Tasks';
      case 'today':
        return "Today's Tasks";
      case 'upcoming':
        return 'Upcoming Tasks';
      case 'completed':
        return 'Completed Tasks';
      case 'category-personal':
        return 'Personal Tasks';
      case 'category-school':
        return 'School & Learning';
      case 'category-work':
        return 'Work & Projects';
      case 'category-other':
        return 'Other Tasks';
      case 'settings':
        return 'Settings';
      default:
        return 'TodoList';
    }
  }, [currentView]);

  // --- Handlers for Authentication Operations ---

  const handleLoginSuccess = (user: AuthUser) => {
    saveAuthSession(user);
    setAuthSession({ isAuthenticated: true, user });
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const handleRegisterSuccess = (user: AuthUser) => {
    saveAuthSession(user);
    setAuthSession({ isAuthenticated: true, user });
    showToast(`Welcome to TaskFlow, ${user.name}!`, 'success');
  };

  const handleLogout = async () => {
    await supabaseSignOut();
    clearAuthSession();
    setAuthSession({ isAuthenticated: false, user: null });
    setIsLogoutConfirmOpen(false);
    setAuthView('login');
    showToast('You have been logged out.', 'info');
  };

  // --- Handlers for Task Operations ---

  // Open Create Task modal (optionally pre-selected category)
  const handleOpenCreateTask = (defaultCategory?: TaskCategory) => {
    if (defaultCategory) {
      setTaskToEdit({
        id: '',
        title: '',
        description: '',
        category: defaultCategory,
        priority: 'medium',
        dueDate: getTodayDateString(),
        completed: false,
        createdAt: '',
        updatedAt: '',
      });
    } else {
      setTaskToEdit(null);
    }
    setIsTaskModalOpen(true);
  };

  // Open Edit Task modal
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Save new or edited task
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const nowISO = new Date().toISOString();

    if (taskData.id) {
      // Editing existing task
      let updatedTaskObj: Task | null = null;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskData.id) {
            updatedTaskObj = {
              ...t,
              title: taskData.title,
              description: taskData.description,
              category: taskData.category,
              priority: taskData.priority,
              dueDate: taskData.dueDate,
              completed: taskData.completed,
              updatedAt: nowISO,
            };
            return updatedTaskObj;
          }
          return t;
        })
      );
      if (updatedTaskObj && authSession.user?.id) {
        saveTaskToSupabase(updatedTaskObj, authSession.user.id);
      }
      showToast('Task updated successfully.');
    } else {
      // Creating new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: nowISO,
        updatedAt: nowISO,
      };
      setTasks((prev) => [newTask, ...prev]);
      if (authSession.user?.id) {
        saveTaskToSupabase(newTask, authSession.user.id);
      }
      showToast('Task created successfully.');
    }
  };

  // Toggle task completion
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updatedStatus = !t.completed;
          showToast(
            updatedStatus ? 'Task marked as completed.' : 'Task marked as pending.',
            'info'
          );
          const updatedTask = {
            ...t,
            completed: updatedStatus,
            updatedAt: new Date().toISOString(),
          };
          if (authSession.user?.id) {
            saveTaskToSupabase(updatedTask, authSession.user.id);
          }
          return updatedTask;
        }
        return t;
      })
    );
  };

  // Trigger Delete confirmation modal
  const handlePromptDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  // Confirm delete task
  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const idToDelete = taskToDelete.id;
    setTasks((prev) => prev.filter((t) => t.id !== idToDelete));
    if (authSession.user?.id) {
      deleteTaskFromSupabase(idToDelete);
    }
    showToast('Task deleted successfully.', 'warning');
    setTaskToDelete(null);
  };

  // Clear all completed tasks
  const handleClearAllCompleted = () => {
    const count = tasks.filter((t) => t.completed).length;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(`Cleared ${count} completed task${count === 1 ? '' : 's'}.`);
  };

  // Clear all tasks
  const handleClearAllTasks = () => {
    setTasks([]);
    showToast('All tasks cleared.', 'warning');
  };

  // Import tasks
  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks);
    showToast(`Imported ${importedTasks.length} tasks successfully.`);
  };

  // 8. If user is NOT authenticated, display the Authentication flow
  if (!authSession.isAuthenticated) {
    const authHeaders: Record<AuthView, { heading: string; subtitle: string }> = {
      login: {
        heading: 'Welcome back!',
        subtitle: 'Log in to your account and keep your plans on track.',
      },
      register: {
        heading: 'Create your account',
        subtitle: 'Start organizing your tasks with TodoList.',
      },
      'forgot-password': {
        heading: 'Forgot your password?',
        subtitle: "Enter your email or phone and we'll help you reset your password.",
      },
      'reset-password': {
        heading: 'Create a new password',
        subtitle: 'Choose a secure password for your TodoList account.',
      },
    };

    const currentHeader = authHeaders[authView];

    return (
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0B1310]">
        <AuthLayout
          heading={currentHeader.heading}
          subtitle={currentHeader.subtitle}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        >
          {authView === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateAuth={setAuthView}
            />
          )}

          {authView === 'register' && (
            <RegisterPage
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateAuth={setAuthView}
            />
          )}

          {authView === 'forgot-password' && (
            <ForgotPasswordPage
              onNavigateAuth={setAuthView}
            />
          )}

          {authView === 'reset-password' && (
            <ResetPasswordPage
              onNavigateAuth={setAuthView}
            />
          )}
        </AuthLayout>

        {/* Floating Toast Notification during authentication */}
        <Toast
          toast={toast}
          onDismiss={() => setToast(null)}
        />
      </div>
    );
  }

  // 9. When user IS authenticated, display the main TodoList Dashboard & Workspace
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0B1310] text-[#0F172A] dark:text-[#F1F5F9] flex flex-col md:flex-row transition-colors">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentUser={authSession.user}
        onLogoutClick={() => setIsLogoutConfirmOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        taskCounts={taskCounts}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <Header
          pageTitle={pageTitle}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && currentView !== 'tasks') {
              setCurrentView('tasks');
            }
          }}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateTask={() => handleOpenCreateTask()}
          currentUser={authSession.user}
          onLogoutClick={() => setIsLogoutConfirmOpen(true)}
          onNavigateSettings={() => setCurrentView('settings')}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          pendingCount={stats.pending}
          overdueCount={stats.overdue}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              stats={stats}
              onOpenCreateTask={() => handleOpenCreateTask()}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              tasks={tasks}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenCreateTask={() => handleOpenCreateTask()}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'today' && (
            <TodayView
              tasks={tasks}
              onOpenCreateTask={() => handleOpenCreateTask()}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'upcoming' && (
            <UpcomingView
              tasks={tasks}
              onOpenCreateTask={() => handleOpenCreateTask()}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'completed' && (
            <CompletedView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
              onClearAllCompleted={handleClearAllCompleted}
            />
          )}

          {currentView === 'category-personal' && (
            <CategoryView
              category="personal"
              tasks={tasks}
              onOpenCreateTask={(cat) => handleOpenCreateTask(cat)}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'category-school' && (
            <CategoryView
              category="school"
              tasks={tasks}
              onOpenCreateTask={(cat) => handleOpenCreateTask(cat)}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'category-work' && (
            <CategoryView
              category="work"
              tasks={tasks}
              onOpenCreateTask={(cat) => handleOpenCreateTask(cat)}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'category-other' && (
            <CategoryView
              category="other"
              tasks={tasks}
              onOpenCreateTask={(cat) => handleOpenCreateTask(cat)}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handlePromptDeleteTask}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              tasks={tasks}
              onClearAllTasks={handleClearAllTasks}
              onImportTasks={handleImportTasks}
              currentUser={authSession.user}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>

      {/* 3. Task Creation & Editing Modal Dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* 4. Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* 5. Logout Confirmation Dialog */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      {/* 6. Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={authSession.user}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* 7. Toast Feedback Notifications */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
