/**
 * @file src/lib/supabase.ts
 * @description Official Supabase Client initialization for TaskFlow.
 * Connected to project: ojflxeuxfsvmvqiljxve.supabase.co
 * 
 * Includes:
 * - Browser Supabase Client (using anon public API key) for client-side Auth, Sessions, and Storage
 * - Service Role Client (for administrative operations, schema synchronization, and elevated tasks)
 */

import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ojflxeuxfsvmvqiljxve.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZmx4ZXV4ZnN2bXZxaWxqeHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjIxMzAsImV4cCI6MjEwNTg5ODEzMH0.FKxIhRhQIEe2yesiguQEUrY_MMYELCD0yXpazFjDOnA';

export const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZmx4ZXV4ZnN2bXZxaWxqeHZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDMyMjEzMCwiZXhwIjoyMTA1ODk4MTMwfQ.YBh_YkaIvN-gqYQ0Qx0ojOnNzdoDo35pMGNbg_9mONc';

/**
 * Standard Supabase client for user authentication, real-time listeners, and table queries
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Service role client for database administration (bypasses RLS)
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
