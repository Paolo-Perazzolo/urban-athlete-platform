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
// These come from your .env file (SUPABASE_URL and SUPABASE_ANON_KEY)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
