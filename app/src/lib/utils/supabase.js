/**
 * SUPABASE CLIENT
 * 
 * This file creates a Supabase client that you'll use throughout your app
 * to interact with the database, authentication, and storage.
 * 
 * Usage in components:
 *   import { supabase } from '$lib/utils/supabase';
 *   const { data, error } = await supabase.from('spots').select('*');
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
// SvelteKit/Vite requires the VITE_ prefix to expose env vars to the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export the Supabase client
// Only create if credentials are available, otherwise the app will still load
let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️ Supabase credentials not found. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
  // Provide a placeholder so imports don't crash
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({})
    },
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } })
    })
  };
}

export { supabase };
